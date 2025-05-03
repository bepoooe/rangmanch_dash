from http.server import BaseHTTPRequestHandler
from datetime import datetime
import json

def handler(request, response):
    response.status_code = 200
    response_data = {
        'status': 'ok',
        'message': 'API server is running',
        'timestamp': datetime.now().isoformat()
    }
    
    return response_data 