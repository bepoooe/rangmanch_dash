# Rangmanch Dashboard

A comprehensive dashboard for social media analytics, featuring a React frontend deployed on Vercel and a Flask API backend hosted on Render.

## Project Overview

The Rangmanch Dashboard is designed to help content creators and social media managers track and analyze their social media presence with:

- YouTube and Instagram data scraping and analytics
- Interactive dashboard with metrics visualization
- Content library and management
- Audience insights

## Architecture

- **Frontend**: React application deployed on Vercel
- **Backend**: Flask API hosted on Render
- **Data Processing**: Python-based scrapers for YouTube and Instagram

## Deployment

### Frontend (Vercel)

The React frontend is deployed on Vercel with the following configuration:

- Configured using `vercel.json` for routing and API proxying
- Environment variables set up to connect to the Render backend
- Static assets served through Vercel's CDN

### Backend (Render)

The Flask API is hosted on Render.com:

- Deployed using the configuration in `render.yaml`
- Processes data scraping requests and serves analytics
- Handles data storage and retrieval
- Provides RESTful API endpoints for the frontend

## API Endpoints

The backend exposes the following key endpoints:

- `/api/health`: Health check endpoint
- `/api/scrape/youtube`: Endpoint to scrape YouTube data
- `/api/scrape/instagram`: Endpoint to scrape Instagram data
- `/api/data/list`: List available data sets
- `/api/tasks/{task_id}`: Check status of running scrape tasks
- `/api/data/{filename}`: Retrieve specific data files

## Environment Variables

### Required for Backend (Render)

```
APIFY_API_TOKEN=your_apify_token
PYTHON_VERSION=3.9.10
```

### Required for Frontend (Vercel)

```
REACT_APP_API_URL=https://your-render-app.onrender.com/api
```

## Local Development

To run the application locally:

1. Install dependencies:
   ```
   npm install
   pip install -r requirements.txt
   ```

2. Start the React application:
   ```
   npm start
   ```

3. In a separate terminal, start the Flask API server:
   ```
   python api_server.py
   ```

## License

[MIT License](LICENSE)
