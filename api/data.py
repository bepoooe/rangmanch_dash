from datetime import datetime
import json

def handler(request, response):
    # Set CORS headers
    response.headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    }
    
    # Handle OPTIONS requests for CORS
    if request.method == "OPTIONS":
        response.status_code = 200
        return {}
    
    # Return some sample data
    response.status_code = 200
    return {
        "success": True,
        "data": [
            {
                "id": 1,
                "name": "Sample YouTube Channel",
                "subscribers": 5000,
                "views": 250000,
                "videos": 45
            },
            {
                "id": 2,
                "name": "Example Instagram Profile",
                "followers": 2500,
                "posts": 120,
                "engagement_rate": 3.5
            }
        ],
        "timestamp": datetime.now().isoformat()
    } 