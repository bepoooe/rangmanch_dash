from datetime import datetime
import json

def handler(request, response):
    # Default headers for CORS
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
    
    # Basic health check endpoint
    if request.url.path == "/api":
        response.status_code = 200
        return {
            "status": "ok", 
            "message": "API server is running",
            "timestamp": datetime.now().isoformat()
        }
    
    # Default response for unhandled routes
    response.status_code = 404
    return {"error": "Not found", "path": request.url.path} 