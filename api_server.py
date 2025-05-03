from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import subprocess
import tempfile
import time
from pathlib import Path
import threading
import shutil
import re

# Import the scraper modules
from youtube_scraper import run_youtube_scraper, process_youtube_data, create_output_folder, save_data
from instagram_scraper import run_instagram_scraper, create_output_folder as create_instagram_output_folder, save_data as save_instagram_data, process_instagram_data

# Import configuration
from config import APIFY_API_TOKEN, YOUTUBE_DATA_DIR, INSTAGRAM_DATA_DIR, API_PORT, DEBUG_MODE

app = Flask(__name__, static_folder='data')
CORS(app)  # Enable CORS for all routes

# Create necessary directories
os.makedirs(YOUTUBE_DATA_DIR, exist_ok=True)
os.makedirs(INSTAGRAM_DATA_DIR, exist_ok=True)
os.makedirs('data/youtube', exist_ok=True)
os.makedirs('data/instagram', exist_ok=True)

# In-memory cache for running tasks
tasks = {}

# Function to delete previous data files for the same account
def delete_previous_data(directory, account_name):
    """
    Delete previous data folders for a specific account
    
    Args:
        directory (str): The base directory (YOUTUBE_DATA_DIR or INSTAGRAM_DATA_DIR)
        account_name (str): The channel name or username to match
    
    Returns:
        int: Number of folders deleted
    """
    if not os.path.exists(directory):
        return 0
    
    deleted_count = 0
    try:
        # Create a safe pattern to match account folders
        # This will match folders like 'account_name_YYYY-MM-DD_HH-MM-SS'
        pattern = re.compile(f"^{re.escape(account_name)}_\\d{{4}}-\\d{{2}}-\\d{{2}}_\\d{{2}}-\\d{{2}}-\\d{{2}}$")
        
        for item in os.listdir(directory):
            folder_path = os.path.join(directory, item)
            if os.path.isdir(folder_path) and pattern.match(item):
                print(f"Deleting previous data folder: {folder_path}")
                shutil.rmtree(folder_path, ignore_errors=True)
                deleted_count += 1
    except Exception as e:
        print(f"Error deleting previous data: {str(e)}")
    
    return deleted_count

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'API server is running'})

@app.route('/api/scrape/youtube', methods=['POST'])
def scrape_youtube():
    data = request.json
    url_or_query = data.get('url')
    
    if not url_or_query:
        return jsonify({'error': 'Missing URL or query parameter'}), 400
    
    # Generate a unique task ID
    task_id = f"youtube_{int(time.time())}"
    
    # Start scraping in a background thread
    def run_scraper():
        try:
            print(f"🔄 Starting YouTube scraper for: {url_or_query}")
            
            # Try to extract channel handle from URL if it's a channel URL
            channel_handle = None
            if "youtube.com/" in url_or_query and "@" in url_or_query:
                handle_match = re.search(r'youtube\.com/(@[^/\s?]+)', url_or_query)
                if handle_match:
                    channel_handle = handle_match.group(1)
                    channel_handle = channel_handle[1:] if channel_handle.startswith('@') else channel_handle
                    print(f"Detected channel handle from URL: {channel_handle}")
            
            # Run the scraper to get raw data
            raw_data = run_youtube_scraper(APIFY_API_TOKEN, url_or_query)
            
            if not raw_data:
                tasks[task_id] = {
                    'status': 'error',
                    'message': 'Failed to retrieve YouTube data',
                    'details': 'No data was returned from the scraper. This could be due to blocking or an invalid URL.'
                }
                return
            
            if len(raw_data) == 0:
                tasks[task_id] = {
                    'status': 'completed',
                    'message': 'YouTube scraper completed but found no data',
                    'data': {
                        'item_count': 0,
                        'error_message': 'No data items were found for the provided URL/query'
                    }
                }
                return
            
            # Process data into standardized format and get channel name
            processed_data, channel_name = process_youtube_data(raw_data)
            
            # If we detected a channel handle from the URL, prioritize that name
            if channel_handle and channel_handle not in channel_name:
                print(f"Prioritizing detected channel handle '{channel_handle}' for folder name")
                channel_name = channel_handle
            
            # Delete previous data for the same channel
            deleted_count = delete_previous_data(YOUTUBE_DATA_DIR, channel_name)
            if deleted_count > 0:
                print(f"Deleted {deleted_count} previous data folder(s) for {channel_name}")
            
            # Create output folder
            output_folder = create_output_folder(channel_name)
            
            # Save the processed data
            saved_files = save_data(processed_data, output_folder, channel_name, ["json"])
            
            # Update task status
            json_file = saved_files.get("json")
            relative_path = os.path.relpath(json_file) if json_file else None
            
            tasks[task_id] = {
                'status': 'completed',
                'message': f'Successfully scraped YouTube data for {channel_name}',
                'data': {
                    'channel_name': channel_name,
                    'item_count': len(processed_data),
                    'file_path': relative_path,
                    'previous_data_deleted': deleted_count
                }
            }
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"❌ Error in YouTube scraper: {str(e)}")
            print(error_details)
            
            tasks[task_id] = {
                'status': 'error',
                'message': f'Error: {str(e)}',
                'details': error_details
            }
    
    # Start the thread
    thread = threading.Thread(target=run_scraper)
    thread.daemon = True
    thread.start()
    
    # Initialize task status
    tasks[task_id] = {
        'status': 'running',
        'message': f'Started YouTube scraping for: {url_or_query}'
    }
    
    return jsonify({
        'task_id': task_id,
        'status': 'running',
        'message': f'Started YouTube scraping for: {url_or_query}'
    })

@app.route('/api/scrape/instagram', methods=['POST'])
def scrape_instagram():
    data = request.json
    username = data.get('username')
    
    if not username:
        return jsonify({'error': 'Missing username parameter'}), 400
    
    # Generate a unique task ID
    task_id = f"instagram_{int(time.time())}"
    
    # Start scraping in a background thread
    def run_scraper():
        try:
            print(f"🔄 Starting Instagram scraper for: {username}")
            
            # Delete previous data for the same username
            deleted_count = delete_previous_data(INSTAGRAM_DATA_DIR, username)
            if deleted_count > 0:
                print(f"Deleted {deleted_count} previous data folder(s) for {username}")
            
            # Create output folder
            output_folder = create_instagram_output_folder(username)
            
            # Run the scraper
            data = run_instagram_scraper(APIFY_API_TOKEN, username)
            
            if not data:
                tasks[task_id] = {
                    'status': 'error',
                    'message': f'Failed to retrieve Instagram data for {username}',
                    'details': 'No data was returned from the scraper. This could be due to blocking, a private account, or an invalid username.'
                }
                return
                
            if len(data) == 0:
                tasks[task_id] = {
                    'status': 'completed',
                    'message': f'Instagram scraper completed but found no data for {username}',
                    'data': {
                        'username': username,
                        'item_count': 0,
                        'error_message': 'No data items were found for the provided username'
                    }
                }
                return
            
            # Check for request error messages
            error_messages = []
            if isinstance(data[0], dict) and 'requestErrorMessages' in data[0]:
                error_messages = data[0]['requestErrorMessages']
            
            # Process the data
            processed_data = process_instagram_data(data, username)
            
            # Save the data
            saved_files = save_instagram_data(processed_data, output_folder, username, ["json"])
            
            # Update task status
            json_file = saved_files.get("json")
            relative_path = os.path.relpath(json_file) if json_file else None
            
            tasks[task_id] = {
                'status': 'completed',
                'message': f'Successfully scraped Instagram data for {username}',
                'data': {
                    'username': username,
                    'item_count': len(processed_data),
                    'file_path': relative_path,
                    'previous_data_deleted': deleted_count,
                    'had_errors': len(error_messages) > 0,
                    'error_count': len(error_messages)
                }
            }
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"❌ Error in Instagram scraper: {str(e)}")
            print(error_details)
            
            tasks[task_id] = {
                'status': 'error',
                'message': f'Error: {str(e)}',
                'details': error_details
            }
    
    # Start the thread
    thread = threading.Thread(target=run_scraper)
    thread.daemon = True
    thread.start()
    
    # Initialize task status
    tasks[task_id] = {
        'status': 'running',
        'message': f'Started Instagram scraping for: {username}'
    }
    
    return jsonify({
        'task_id': task_id,
        'status': 'running',
        'message': f'Started Instagram scraping for: {username}'
    })

@app.route('/api/tasks/<task_id>', methods=['GET'])
def get_task_status(task_id):
    task = tasks.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    return jsonify(task)

@app.route('/api/data/<path:filename>', methods=['GET'])
def get_data(filename):
    # Security check to prevent directory traversal
    path = os.path.normpath(filename)
    print(f"Request for data file: {path}")
    
    if '..' in path:
        print(f"⚠️ Directory traversal attempt detected: {path}")
        return jsonify({'error': 'Invalid path'}), 400
    
    # Handle absolute paths by removing drive letter and leading slash if present
    if os.path.isabs(path):
        print(f"Converting absolute path: {path}")
        # Remove drive letter on Windows (e.g., C:)
        if ':' in path:
            path = path.split(':', 1)[1]
        # Remove leading slash
        path = path.lstrip('\\/')
        print(f"Converted to relative path: {path}")
    
    # Check if the file exists
    if not os.path.isfile(path):
        print(f"❌ File not found: {path}")
        # Try to find the file in common data directories
        alt_paths = [
            os.path.join(YOUTUBE_DATA_DIR, os.path.basename(path)),
            os.path.join(INSTAGRAM_DATA_DIR, os.path.basename(path)),
            os.path.join('data', 'youtube', os.path.basename(path)),
            os.path.join('data', 'instagram', os.path.basename(path))
        ]
        
        for alt_path in alt_paths:
            if os.path.isfile(alt_path):
                print(f"✅ Found file at alternate path: {alt_path}")
                path = alt_path
                break
        
        if not os.path.isfile(path):
            return jsonify({'error': 'File not found', 'path': path, 'tried': alt_paths}), 404
    
    directory = os.path.dirname(path)
    file = os.path.basename(path)
    
    print(f"Serving file: {file} from directory: {directory}")
    
    try:
        # Explicitly load and return JSON to ensure proper formatting
        if file.endswith('.json'):
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                print(f"Successfully loaded JSON data with {len(data) if isinstance(data, list) else 'non-list'} items")
                
                # Add debug info about the first few items
                if isinstance(data, list) and len(data) > 0:
                    first_item = data[0]
                    if isinstance(first_item, dict):
                        keys = list(first_item.keys())
                        print(f"First item keys: {keys[:10]}{'...' if len(keys) > 10 else ''}")
                        
                        # Check if important keys are present
                        if 'youtube' in path.lower():
                            important_keys = ['channel_name', 'title', 'views', 'likes']
                            missing = [k for k in important_keys if k not in first_item]
                            if missing:
                                print(f"⚠️ Missing important YouTube keys: {missing}")
                        elif 'instagram' in path.lower():
                            important_keys = ['username', 'ownerUsername', 'likesCount']
                            missing = [k for k in important_keys if k not in first_item]
                            if missing:
                                print(f"⚠️ Missing important Instagram keys: {missing}")
                
                return jsonify(data)
        
        # For non-JSON files, use send_from_directory
        return send_from_directory(directory, file)
    except Exception as e:
        print(f"❌ Error serving file {path}: {str(e)}")
        return jsonify({'error': f'Error reading file: {str(e)}'}), 500

@app.route('/api/data/list', methods=['GET'])
def list_data():
    youtube_data = []
    instagram_data = []
    
    # Keep track of processed channels/users to avoid duplicates
    processed_youtube_channels = set()
    processed_instagram_users = set()
    
    # List YouTube data - optimized to prioritize newest data
    if os.path.exists(YOUTUBE_DATA_DIR):
        # Get all folders sorted by creation time (newest first)
        youtube_folders = []
        for root, dirs, files in os.walk(YOUTUBE_DATA_DIR):
            if root == YOUTUBE_DATA_DIR:  # Only process top-level folders
                for folder in dirs:
                    folder_path = os.path.join(YOUTUBE_DATA_DIR, folder)
                    creation_time = os.path.getctime(folder_path)
                    try:
                        channel_name = folder.split('_')[0]
                        youtube_folders.append((folder_path, channel_name, creation_time))
                    except IndexError:
                        continue
        
        # Sort by creation time (newest first)
        youtube_folders.sort(key=lambda x: x[2], reverse=True)
        
        # Process folders, but only include the most recent data for each channel
        for folder_path, channel_name, _ in youtube_folders:
            if channel_name in processed_youtube_channels:
                continue
                
            json_files = [f for f in os.listdir(folder_path) if f.endswith('.json')]
            if not json_files:
                continue
                
            json_path = os.path.join(folder_path, json_files[0])
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if data and len(data) > 0:
                        youtube_data.append({
                            'channel_name': channel_name,
                            'item_count': len(data),
                            'file_path': json_path,
                            'created': os.path.getctime(json_path),
                            'data': data[:5]  # Preview of first 5 items
                        })
                        processed_youtube_channels.add(channel_name)
            except Exception as e:
                print(f"Error loading YouTube data from {json_path}: {str(e)}")
    
    # List Instagram data - optimized to prioritize newest data
    if os.path.exists(INSTAGRAM_DATA_DIR):
        # Get all folders sorted by creation time (newest first)
        instagram_folders = []
        for root, dirs, files in os.walk(INSTAGRAM_DATA_DIR):
            if root == INSTAGRAM_DATA_DIR:  # Only process top-level folders
                for folder in dirs:
                    folder_path = os.path.join(INSTAGRAM_DATA_DIR, folder)
                    creation_time = os.path.getctime(folder_path)
                    try:
                        username = folder.split('_')[0]
                        instagram_folders.append((folder_path, username, creation_time))
                    except IndexError:
                        continue
        
        # Sort by creation time (newest first)
        instagram_folders.sort(key=lambda x: x[2], reverse=True)
        
        # Process folders, but only include the most recent data for each username
        for folder_path, username, _ in instagram_folders:
            if username in processed_instagram_users:
                continue
                
            json_files = [f for f in os.listdir(folder_path) if f.endswith('.json')]
            if not json_files:
                continue
                
            json_path = os.path.join(folder_path, json_files[0])
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if data and len(data) > 0:
                        instagram_data.append({
                            'username': username,
                            'item_count': len(data),
                            'file_path': json_path,
                            'created': os.path.getctime(json_path),
                            'data': data[:5]  # Preview of first 5 items
                        })
                        processed_instagram_users.add(username)
            except Exception as e:
                print(f"Error loading Instagram data from {json_path}: {str(e)}")
    
    return jsonify({
        'youtube': sorted(youtube_data, key=lambda x: x['created'], reverse=True),
        'instagram': sorted(instagram_data, key=lambda x: x['created'], reverse=True)
    })

@app.route('/api/config', methods=['GET'])
def get_config():
    # Return only non-sensitive configuration
    return jsonify({
        'youtube_data_dir': YOUTUBE_DATA_DIR,
        'instagram_data_dir': INSTAGRAM_DATA_DIR,
        'is_api_token_set': bool(APIFY_API_TOKEN and not APIFY_API_TOKEN.endswith('YOUR_TOKEN_HERE'))
    })

@app.route('/api/config/token', methods=['POST'])
def update_token():
    data = request.json
    new_token = data.get('token')
    
    if not new_token:
        return jsonify({'error': 'Missing token parameter'}), 400
    
    # Update the token in the config file
    config_path = 'config.py'
    try:
        with open(config_path, 'r') as f:
            config_content = f.read()
        
        # Replace the token
        updated_content = config_content.replace(
            f'APIFY_API_TOKEN = "{APIFY_API_TOKEN}"',
            f'APIFY_API_TOKEN = "{new_token}"'
        )
        
        with open(config_path, 'w') as f:
            f.write(updated_content)
        
        return jsonify({'status': 'success', 'message': 'API token updated successfully'})
    except Exception as e:
        return jsonify({'error': f'Failed to update token: {str(e)}'}), 500

if __name__ == '__main__':
    # Get port from environment variable for platforms like Render
    port = int(os.environ.get('PORT', API_PORT))
    
    print(f"Starting API server on port {port}")
    print(f"API token status: {'Configured' if APIFY_API_TOKEN and not APIFY_API_TOKEN.endswith('YOUR_TOKEN_HERE') else 'Not configured - Please update in config.py'}")
    
    # For production, listen on all interfaces (0.0.0.0)
    app.run(host='0.0.0.0', debug=DEBUG_MODE, port=port) 