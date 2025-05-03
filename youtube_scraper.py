import requests
import json
import os
import time
import argparse
from datetime import datetime
import csv
import re
import random
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def create_session_with_retries():
    """Create a requests session with retry logic"""
    session = requests.Session()
    retries = Retry(
        total=5,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET", "POST"]
    )
    adapter = HTTPAdapter(max_retries=retries)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session

def run_youtube_scraper(api_token, url_or_query):
    """Run the YouTube scraper using Apify API."""
    # Create a session with retries
    session = create_session_with_retries()
    
    # Look for YouTube scraper actors in the user's account
    print(f"Looking for YouTube scraper actors in your Apify account...")
    search_url = f"https://api.apify.com/v2/acts?token={api_token}"
    search_response = session.get(search_url)
    
    if search_response.status_code != 200:
        print(f"❌ Failed to search actors: {search_response.status_code}, {search_response.text}")
        return None
    
    # Find YouTube scraper actors
    actors_data = search_response.json()
    available_actors = actors_data.get('data', {}).get('items', [])
    
    youtube_actors = []
    for actor in available_actors:
        name = actor.get('name', '').lower()
        if 'youtube' in name and ('scraper' in name or 'crawler' in name or 'extractor' in name):
            youtube_actors.append(actor)
    
    if not youtube_actors:
        print("❌ No YouTube scraper actors found. Please add one to your Apify account.")
        print("Recommended: YouTube Scraper (https://apify.com/apify/youtube-scraper)")
        
        # Fallback to known YouTube scraper actor
        print("Using default YouTube scraper actor as fallback...")
        youtube_actors = [{
            'id': 'mpYxtaoX6',  # Default YouTube scraper actor ID
            'name': 'youtube-scraper'
        }]
    
    # Use the first YouTube scraper found
    actor = youtube_actors[0]
    actor_id = actor.get('id')
    actor_name = actor.get('name')
    
    print(f"Found YouTube scraper: {actor_name} (ID: {actor_id})")
    
    # Create input configuration based on provided URL or search query
    input_config = {}
    if "youtube.com" in url_or_query or "youtu.be" in url_or_query:
        # For video URL
        if "watch?v=" in url_or_query or "youtu.be" in url_or_query:
            input_config = {
                "startUrls": [{"url": url_or_query}],
                "maxResults": 1,
                "proxy": {
                    "useApifyProxy": True,
                    "apifyProxyGroups": ["RESIDENTIAL"]  # Use residential proxies for better success
                },
                "extendOutputFunction": """
                    ({ data, customData }) => {
                        return {
                            ...data,
                            comments: customData && customData.comments || [],
                            likeCount: data.likeCount || data.likes || 
                                      (data.statistics ? data.statistics.likeCount : null)
                        }
                    }
                """,
                "commentsLimit": 5,
                "maxComments": 5,
                "scrapeCommentReplies": True,
                "includeLikes": True,  # Explicitly request likes data
                "scrapeStatistics": True
            }
        # For channel URL
        else:
            input_config = {
                "startUrls": [{"url": url_or_query}],
                "maxResults": 20,  # Reduced from 50 to limit blocking
                "proxy": {
                    "useApifyProxy": True,
                    "apifyProxyGroups": ["RESIDENTIAL"]  # Use residential proxies for better success
                },
                "extendOutputFunction": """
                    ({ data, customData }) => {
                        return {
                            ...data,
                            comments: customData && customData.comments || [],
                            likeCount: data.likeCount || data.likes || 
                                      (data.statistics ? data.statistics.likeCount : null)
                        }
                    }
                """,
                "commentsLimit": 5,
                "maxComments": 5,
                "scrapeCommentReplies": True,
                "includeLikes": True,  # Explicitly request likes data
                "scrapeStatistics": True
            }
    else:
        # For search query
        input_config = {
            "search": url_or_query,
            "maxResults": 20,  # Reduced from 50 to limit blocking
            "proxy": {
                "useApifyProxy": True,
                "apifyProxyGroups": ["RESIDENTIAL"]  # Use residential proxies for better success
            },
            "extendOutputFunction": """
                ({ data, customData }) => {
                    return {
                        ...data,
                        comments: customData && customData.comments || [],
                        likeCount: data.likeCount || data.likes || 
                                  (data.statistics ? data.statistics.likeCount : null)
                    }
                }
            """,
            "commentsLimit": 5,
            "maxComments": 5,
            "scrapeCommentReplies": True,
            "includeLikes": True,  # Explicitly request likes data
            "scrapeStatistics": True
        }
    
    print(f"Starting YouTube scraper for: {url_or_query}")
    print(f"Using actor ID: {actor_id}")
    
    # Add delay to avoid rate limiting
    time.sleep(random.uniform(1.0, 3.0))
    
    # Start the actor run
    start_url = f"https://api.apify.com/v2/acts/{actor_id}/runs?token={api_token}"
    start_response = session.post(start_url, json=input_config)
    
    if start_response.status_code != 201:
        print(f"❌ Failed to start actor: {start_response.status_code}, {start_response.text}")
        return None
    
    run_data = start_response.json()
    
    # Extract run ID from the response
    run_id = None
    
    # First attempt - direct access to id
    if 'data' in run_data and 'id' in run_data['data']:
        run_id = run_data['data']['id']
    
    # Second attempt - check for actorRunId 
    elif 'data' in run_data and 'actorRunId' in run_data['data']:
        run_id = run_data['data']['actorRunId']
    
    # Third attempt - check for id in the root
    elif 'id' in run_data:
        run_id = run_data['id']
    
    # Final attempt - parse from resource URL if available
    elif 'data' in run_data and 'resource' in run_data['data']:
        resource_url = run_data['data']['resource']
        if resource_url:
            run_id_match = resource_url.split('/')[-1]
            if run_id_match:
                run_id = run_id_match
    
    if not run_id:
        print("❌ No run ID returned")
        print("Response:", json.dumps(run_data, indent=2))
        return None
    
    print(f"✅ Actor started, run ID: {run_id}")
    
    # Poll for run status
    status_url = f"https://api.apify.com/v2/actor-runs/{run_id}?token={api_token}"
    max_attempts = 60  # 10 minutes with 10-second intervals
    
    for attempt in range(max_attempts):
        time.sleep(10)  # Wait 10 seconds between checks
        
        # Add a bit of randomization to avoid predictable patterns
        if attempt > 0 and attempt % 5 == 0:
            time.sleep(random.uniform(2.0, 5.0))
        
        status_response = session.get(status_url)
        if status_response.status_code != 200:
            print(f"❌ Failed to get run status: {status_response.status_code}")
            continue
        
        status_data = status_response.json()
        status = status_data.get('data', {}).get('status')
        
        print(f"Run status: {status} (attempt {attempt+1}/{max_attempts})")
        
        if status in ['SUCCEEDED', 'FAILED', 'TIMED-OUT', 'ABORTED']:
            break
    
    # Even if run failed, try to get any partial data
    dataset_id = status_data.get('data', {}).get('defaultDatasetId')
    if not dataset_id:
        print("❌ No dataset ID found")
        return None
    
    # Add delay before requesting data
    time.sleep(random.uniform(1.0, 3.0))
    
    items_url = f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={api_token}"
    items_response = session.get(items_url)
    
    if items_response.status_code != 200:
        print(f"❌ Failed to get dataset items: {items_response.status_code}")
        return None
    
    data = items_response.json()
    
    # Return empty list instead of None if no data was retrieved
    if not data:
        print("⚠️ No data items were scraped")
        return []
        
    print(f"✅ Retrieved {len(data)} items from the dataset")
    
    # Record any error messages for troubleshooting
    error_messages = []
    for item in data:
        if isinstance(item, dict) and 'errorMessage' in item:
            error_messages.append(item['errorMessage'])
        if isinstance(item, dict) and 'error' in item:
            error_messages.append(item['error'])
            
    if error_messages:
        print(f"⚠️ Found {len(error_messages)} error messages in the data:")
        for msg in error_messages[:5]:  # Show first 5 errors
            print(f" - {msg}")
        if len(error_messages) > 5:
            print(f" - And {len(error_messages) - 5} more...")
    
    return data

def create_output_folder(name):
    """Create output folder for the results."""
    # Sanitize name to create a valid folder name
    # Remove any characters that are invalid in file paths
    invalid_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*']
    sanitized_name = name
    for char in invalid_chars:
        sanitized_name = sanitized_name.replace(char, '_')
    
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    folder_path = f"youtube_data/{sanitized_name}_{timestamp}"
    os.makedirs(folder_path, exist_ok=True)
    return folder_path

def format_date(date_str):
    """Format the date string to a more readable format."""
    if not date_str:
        return ""
    
    try:
        # Parse ISO 8601 date format
        date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        # Format as a more readable date
        return date_obj.strftime("%B %d, %Y - %I:%M %p")
    except:
        return date_str

def save_data(data, folder_path, filename="youtube_data", formats=None):
    """Save data to multiple file formats."""
    if formats is None:
        formats = ["json", "csv", "html"]  # Default formats
    
    print(f"Saving data to {folder_path} in formats: {formats}")
    results = {}
    
    # Save JSON data
    if "json" in formats:
        # Format dates in the JSON data
        formatted_data = []
        for item in data:
            item_copy = item.copy()
            if 'date' in item_copy and item_copy['date']:
                item_copy['date'] = format_date(item_copy['date'])
                # Also save the original ISO date for reference
                item_copy['originalISODate'] = item['date']
            formatted_data.append(item_copy)
            
        json_path = os.path.join(folder_path, f"{filename}.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(formatted_data, f, ensure_ascii=False, indent=2)
        print(f"✅ Saved JSON data to {json_path}")
        results["json"] = json_path
    
    # Save as CSV
    if "csv" in formats:
        csv_path = os.path.join(folder_path, f"{filename}.csv")
        if data:
            # Format dates for CSV
            formatted_data = []
            for item in data:
                item_copy = item.copy()
                if 'date' in item_copy and item_copy['date']:
                    item_copy['date'] = format_date(item_copy['date'])
                formatted_data.append(item_copy)
                
            with open(csv_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=formatted_data[0].keys())
                writer.writeheader()
                writer.writerows(formatted_data)
            print(f"✅ Saved CSV data to {csv_path}")
            results["csv"] = csv_path
    
    # Save as HTML
    if "html" in formats:
        try:
            html_path = os.path.join(folder_path, f"{filename}.html")
            
            # Calculate total view count and likes
            total_views = sum(item.get('viewCount', 0) for item in data if isinstance(item.get('viewCount', 0), (int, float)))
            total_likes = sum(item.get('likes', 0) for item in data if isinstance(item.get('likes', 0), (int, float)))
            
            # Get channel info from the first item if available
            channel_name = filename
            subscriber_count = 0
            channel_url = ""
            if data and len(data) > 0:
                channel_name = data[0].get('channelName', filename)
                subscriber_count = data[0].get('numberOfSubscribers', 0)
                channel_url = data[0].get('channelUrl', "")
            
            # Generate HTML content
            html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>YouTube Data: {channel_name}</title>
    <style>
        :root {{
            --bg-color: #111420;
            --card-bg: #1e2132;
            --text-color: #f5f5f5;
            --primary: #ff0000;
            --secondary: #ff5252;
            --accent: #4285f4;
            --muted-text: #a0a0a0;
            --border-color: #333648;
        }}
        body {{ font-family: 'Segoe UI', Roboto, Arial, sans-serif; margin: 0; padding: 0; background-color: var(--bg-color); color: var(--text-color); }}
        .container {{ max-width: 1200px; margin: 20px auto; background: var(--card-bg); border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); padding: 25px; }}
        h1 {{ color: var(--primary); margin-bottom: 10px; text-align: center; }}
        h2 {{ color: var(--accent); margin-top: 0; text-align: center; font-weight: normal; margin-bottom: 30px; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color); }}
        th {{ background-color: var(--primary); color: white; }}
        tr:hover {{ background-color: rgba(255, 0, 0, 0.1); }}
        .stats {{ display: flex; margin-bottom: 30px; gap: 20px; flex-wrap: wrap; }}
        .stat-block {{ flex: 1; background: var(--card-bg); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid var(--primary); }}
        .stat-value {{ font-size: 28px; font-weight: bold; color: var(--accent); margin-bottom: 10px; }}
        .stat-label {{ font-size: 16px; color: var(--text-color); }}
        .search-input {{ width: 100%; padding: 12px; font-size: 16px; margin-bottom: 20px; border: 2px solid var(--border-color); background: var(--bg-color); color: var(--text-color); border-radius: 8px; }}
        a {{ color: var(--accent); text-decoration: none; }}
        a:hover {{ text-decoration: underline; }}
        .channel-info {{ display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }}
        .channel-link {{ background-color: var(--primary); color: white; padding: 8px 16px; border-radius: 20px; margin-left: 10px; }}
        .channel-link:hover {{ background-color: var(--secondary); text-decoration: none; }}
        .date-cell {{ white-space: nowrap; }}
    </style>
    <script>
        function searchTable() {{
            let input = document.getElementById("searchInput");
            let filter = input.value.toUpperCase();
            let table = document.getElementById("videoTable");
            let tr = table.getElementsByTagName("tr");
            
            for (let i = 1; i < tr.length; i++) {{
                let found = false;
                let td = tr[i].getElementsByTagName("td");
                for (let j = 0; j < td.length; j++) {{
                    if (td[j]) {{
                        let txtValue = td[j].textContent || td[j].innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {{
                            found = true;
                            break;
                        }}
                    }}
                }}
                tr[i].style.display = found ? "" : "none";
            }}
        }}
    </script>
</head>
<body>
    <div class="container">
        <h1>{channel_name}</h1>
        <h2>{subscriber_count:,} subscribers</h2>
        
        <div class="channel-info">
            <a href="{channel_url}" target="_blank" class="channel-link">Visit Channel</a>
        </div>
        
        <div class="stats">
            <div class="stat-block">
                <div class="stat-value">{len(data)}</div>
                <div class="stat-label">Videos</div>
            </div>
            <div class="stat-block">
                <div class="stat-value">{total_views:,}</div>
                <div class="stat-label">Total Views</div>
            </div>
            <div class="stat-block">
                <div class="stat-value">{total_likes:,}</div>
                <div class="stat-label">Total Likes</div>
            </div>
        </div>
        
        <input type="text" id="searchInput" class="search-input" onkeyup="searchTable()" placeholder="Search videos...">
        
        <table id="videoTable">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Views</th>
                    <th>Likes</th>
                    <th>Duration</th>
                    <th>Published Date</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
"""
            
            # Add table rows for each video
            for item in data:
                title = item.get('title', '')
                views = f"{item.get('viewCount', 0):,}"
                likes = f"{item.get('likes', 0):,}"
                duration = item.get('duration', '')
                date = format_date(item.get('date', ''))
                url = item.get('url', '')
                
                html_content += f"""                <tr>
                    <td>{title}</td>
                    <td>{views}</td>
                    <td>{likes}</td>
                    <td>{duration}</td>
                    <td class="date-cell">{date}</td>
                    <td><a href="{url}" target="_blank">View</a></td>
                </tr>
"""
            
            # Close the HTML
            html_content += """            </tbody>
        </table>
    </div>
</body>
</html>"""
            
            # Write HTML to file
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            print(f"✅ Saved HTML report to {html_path}")
            results["html"] = html_path
            
        except Exception as e:
            print(f"❌ Failed to generate HTML: {str(e)}")
    
    return results

def process_youtube_data(data):
    """Process YouTube data into a structured format."""
    # Extract channel name from the data
    channel_name = None
    channel_owner = None
    channel_url = None
    channel_handle = None
    standardized_data = []
    
    # First, try to extract channel handle from URL or data
    for item in data:
        # Look for channel URL that contains a handle like @username
        if 'channelUrl' in item and item['channelUrl']:
            url = item['channelUrl']
            handle_match = re.search(r'youtube\.com/(@[^/\s]+)', url)
            if handle_match:
                channel_handle = handle_match.group(1)
                # Remove the @ for folder naming
                channel_handle = channel_handle[1:] if channel_handle.startswith('@') else channel_handle
                print(f"Found channel handle from URL: {channel_handle}")
                break
    
    # If no handle found, check author fields
    if not channel_handle:
        for item in data:
            # Check if any fields directly contain the handle format
            if 'author' in item and item['author'] and item['author'].startswith('@'):
                channel_handle = item['author'][1:]  # Remove the @
                print(f"Found channel handle from author field: {channel_handle}")
                break
            if 'channelTitle' in item and item['channelTitle'] and item['channelTitle'].startswith('@'):
                channel_handle = item['channelTitle'][1:]  # Remove the @
                print(f"Found channel handle from channelTitle field: {channel_handle}")
                break
    
    # Try to extract channel owner name from the most reliable fields
    for item in data:
        # Look for channel owner in various fields
        # Try channel owner fields first (preferred over channel/uploader fields)
        if 'ownerChannelName' in item and item['ownerChannelName'] and not item['ownerChannelName'].startswith('UC'):
            channel_owner = item['ownerChannelName']
            break
        # Then try author fields which often contain the visible channel name
        if 'author' in item and item['author'] and not item['author'].startswith('UC'):
            channel_owner = item['author']
            break
        # Try the title fields
        if 'channelTitle' in item and item['channelTitle'] and not item['channelTitle'].startswith('UC'):
            channel_owner = item['channelTitle']
            break
        # Check for nested channel objects
        if 'channel' in item and isinstance(item['channel'], dict):
            if 'name' in item['channel'] and item['channel']['name'] and not item['channel']['name'].startswith('UC'):
                channel_owner = item['channel']['name']
                break
            if 'title' in item['channel'] and item['channel']['title'] and not item['channel']['title'].startswith('UC'):
                channel_owner = item['channel']['title']
                break
        
        # Check for snippet which might contain channel information
        if 'snippet' in item and isinstance(item['snippet'], dict):
            if 'channelTitle' in item['snippet'] and item['snippet']['channelTitle'] and not item['snippet']['channelTitle'].startswith('UC'):
                channel_owner = item['snippet']['channelTitle']
                break
    
    # Now try to extract the channel identifier (which might be needed as fallback)
    for item in data:
        # Try multiple fields that might contain channel name
        if 'channelTitle' in item and item['channelTitle']:
            channel_name = item['channelTitle']
            break
        if 'channelId' in item and item['channelId']:
            channel_name = item['channelId']
            break
        if 'authorId' in item and item['authorId']:
            channel_name = item['authorId']
            break
        if 'ownerChannelId' in item and item['ownerChannelId']:
            channel_name = item['ownerChannelId']
            break
    
    # If no channel name was found, try to extract from URL or use default
    if not channel_name:
        for item in data:
            if 'channelUrl' in item and item['channelUrl']:
                # Try to extract from URL
                url = item['channelUrl']
                match = re.search(r'/(channel|c|user)/([^/]+)', url)
                if match:
                    channel_name = match.group(2)
                    break
    
    # Prioritize using the channel handle as the filename if available
    if channel_handle:
        file_name = channel_handle
        print(f"Using channel handle for files: {file_name}")
    # Otherwise, fall back to the channel owner name
    elif channel_owner:
        file_name = channel_owner
        print(f"Using channel owner name for files: {file_name}")
    # If neither is available, use the channel identifier
    elif channel_name:
        file_name = channel_name
        print(f"Using channel identifier for files: {file_name}")
    # If still no usable name, use a default with timestamp
    else:
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        file_name = f"youtube_channel_{timestamp}"
        print(f"Using default filename: {file_name}")
    
    # Clean name for file naming
    file_name = re.sub(r'[\\/*?:"<>|]', "_", file_name)
    
    # For all data items, record both the channel ID and the channel owner name
    # to ensure consistent identification
    for item in data:
        processed_item = {}
        
        # Add channel name to every item
        processed_item['channel_name'] = channel_name
        if channel_owner:
            processed_item['channel_owner'] = channel_owner
        if channel_handle:
            processed_item['channel_handle'] = channel_handle
        
        # Common fields
        processed_item['platform'] = 'youtube'
        processed_item['scrape_date'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Map YouTube data to standardized format
        # ID and URL
        if 'id' in item:
            processed_item['id'] = item['id']
        
        if 'url' in item:
            processed_item['url'] = item['url']
        
        # Content type detection
        if 'type' in item:
            processed_item['content_type'] = item['type']
        else:
            # Try to determine content type from URL or other fields
            is_channel = False
            is_video = False
            
            if 'url' in item:
                url = item['url']
                if '/channel/' in url or '/c/' in url or '/user/' in url or '/@' in url:
                    is_channel = True
                elif 'watch?v=' in url or 'youtu.be/' in url:
                    is_video = True
            
            if is_channel:
                processed_item['content_type'] = 'channel'
            elif is_video:
                processed_item['content_type'] = 'video'
            else:
                processed_item['content_type'] = 'unknown'
        
        # Title and description
        if 'title' in item:
            processed_item['title'] = item['title']
        
        if 'description' in item:
            processed_item['description'] = item['description']
        
        # Channel/creator info
        if 'channelTitle' in item:
            processed_item['creator_name'] = item['channelTitle']
        elif 'author' in item:
            processed_item['creator_name'] = item['author']
        elif 'ownerChannelName' in item:
            processed_item['creator_name'] = item['ownerChannelName']
        
        if 'channelId' in item:
            processed_item['creator_id'] = item['channelId']
        elif 'authorId' in item:
            processed_item['creator_id'] = item['authorId']
        elif 'ownerChannelId' in item:
            processed_item['creator_id'] = item['ownerChannelId']
        
        if 'channelUrl' in item:
            processed_item['creator_url'] = item['channelUrl']
            channel_url = item['channelUrl']
        elif 'authorUrl' in item:
            processed_item['creator_url'] = item['authorUrl']
            channel_url = item['authorUrl']
        
        # Publication date
        if 'publishedAt' in item:
            processed_item['published_date'] = item['publishedAt']
        elif 'date' in item:
            processed_item['published_date'] = item['date']
        
        # Engagement metrics - extract and normalize values
        if 'viewCount' in item:
            try:
                processed_item['views'] = int(item['viewCount'])
            except (ValueError, TypeError):
                if isinstance(item['viewCount'], str):
                    # Try to parse string with commas or other formatting
                    try:
                        processed_item['views'] = int(item['viewCount'].replace(',', ''))
                    except ValueError:
                        processed_item['views'] = 0
                else:
                    processed_item['views'] = 0
        
        # Look for likes data in various locations and formats
        likes_value = None
        
        # Check direct like fields first
        if 'likeCount' in item and item['likeCount'] is not None:
            likes_value = item['likeCount']
        elif 'likes' in item and item['likes'] is not None:
            likes_value = item['likes']
        # Check statistics object
        elif 'statistics' in item and isinstance(item['statistics'], dict):
            if 'likeCount' in item['statistics'] and item['statistics']['likeCount'] is not None:
                likes_value = item['statistics']['likeCount']
        # Check snippet object
        elif 'snippet' in item and isinstance(item['snippet'], dict):
            if 'likeCount' in item['snippet'] and item['snippet']['likeCount'] is not None:
                likes_value = item['snippet']['likeCount']
        # Check engagement object
        elif 'engagement' in item and isinstance(item['engagement'], dict):
            if 'likes' in item['engagement'] and item['engagement']['likes'] is not None:
                likes_value = item['engagement']['likes']
        
        # Convert likes value to integer
        if likes_value is not None:
            try:
                if isinstance(likes_value, str):
                    # Clean string of any formatting
                    likes_value = likes_value.replace(',', '')
                processed_item['likes'] = int(float(likes_value))
            except (ValueError, TypeError):
                processed_item['likes'] = 0
        
        # Comment count
        if 'commentCount' in item:
            try:
                processed_item['comments_count'] = int(item['commentCount'])
            except (ValueError, TypeError):
                if isinstance(item['commentCount'], str):
                    try:
                        processed_item['comments_count'] = int(item['commentCount'].replace(',', ''))
                    except ValueError:
                        processed_item['comments_count'] = 0
                else:
                    processed_item['comments_count'] = 0
        
        if 'subscriberCount' in item:
            try:
                processed_item['followers'] = int(item['subscriberCount'])
            except (ValueError, TypeError):
                if isinstance(item['subscriberCount'], str):
                    try:
                        processed_item['followers'] = int(item['subscriberCount'].replace(',', ''))
                    except ValueError:
                        processed_item['followers'] = 0
                else:
                    processed_item['followers'] = 0
        
        # Duration (for videos)
        if 'duration' in item:
            processed_item['duration'] = item['duration']
        
        # Thumbnail
        if 'thumbnails' in item and item['thumbnails']:
            # Find highest quality thumbnail
            found = False
            for quality in ['maxres', 'high', 'medium', 'default']:
                if quality in item['thumbnails'] and item['thumbnails'][quality] and 'url' in item['thumbnails'][quality]:
                    processed_item['thumbnail_url'] = item['thumbnails'][quality]['url']
                    found = True
                    break
        
        standardized_data.append(processed_item)
    
    return standardized_data, file_name

def main():
    parser = argparse.ArgumentParser(description="YouTube Scraper using Apify")
    parser.add_argument("url_or_query", help="YouTube URL or search query")
    parser.add_argument("--api-token", required=True, help="Your Apify API token")
    parser.add_argument("--format", default="html,json,csv", help="Output format(s), comma-separated: html,json,csv")
    args = parser.parse_args()
    
    url_or_query = args.url_or_query
    api_token = args.api_token
    
    # Parse formats
    formats = [fmt.strip().lower() for fmt in args.format.split(",")]
    
    # Try to extract channel handle from URL if it's a channel URL
    channel_handle = None
    if "youtube.com/" in url_or_query and "@" in url_or_query:
        handle_match = re.search(r'youtube\.com/(@[^/\s?]+)', url_or_query)
        if handle_match:
            channel_handle = handle_match.group(1)
            channel_handle = channel_handle[1:] if channel_handle.startswith('@') else channel_handle
            print(f"Detected channel handle from URL: {channel_handle}")
    
    # Run the scraper to get raw data first
    raw_data = run_youtube_scraper(api_token, url_or_query)
    
    if not raw_data or len(raw_data) == 0:
        print(f"\n❌ Failed to retrieve any YouTube data")
        return
    
    # Process data into standardized format and get channel owner name
    processed_data, owner_name = process_youtube_data(raw_data)
    
    # If we detected a channel handle from the URL, prioritize that name
    if channel_handle and channel_handle not in owner_name:
        print(f"Prioritizing detected channel handle '{channel_handle}' for folder name")
        owner_name = channel_handle
    
    # Use the channel owner name for output folder
    output_folder = create_output_folder(owner_name)
    print(f"Created output folder: {output_folder}")
    
    # Save the processed data in requested formats with the channel owner's name
    saved_files = save_data(processed_data, output_folder, owner_name, formats)
    
    print(f"\n✅ Successfully retrieved YouTube data for {owner_name}")
    print(f"Found {len(processed_data)} videos")
    print(f"Output saved to {output_folder}")
    
    # Print summary of saved files
    print("\n📁 Saved in the following formats:")
    for fmt, path in saved_files.items():
        print(f"  - {fmt.upper()}: {os.path.basename(path)}")

if __name__ == "__main__":
    main() 