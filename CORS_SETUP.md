# CORS Setup for Your Flask API

To allow the frontend to call your API directly (so players can see the real vulnerable URL in the network tab), you need to add CORS headers to your Flask API.

## Option 1: Using flask-cors (Recommended)

```bash
pip install flask-cors
```

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:9002"])  # Allow CTF frontend

# Your existing routes...
```

## Option 2: Manual CORS headers

```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:9002')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Your existing routes...
```

## What This Does

- **Without CORS**: Browser blocks the direct API call, shows error in console
- **With CORS**: Players can see `http://127.0.0.1:5000/api/v1/books/get?id=1` in network tab
- **Result**: Real vulnerable URL is visible and testable in browser tools

## Current Frontend Behavior

The frontend now:
1. Shows a list of 6 books (static data)
2. When clicked, makes DIRECT call to: `http://127.0.0.1:5000/api/v1/books/get?id=X`
3. Handles your API response format: `[{"id": 1, "title": "Book One", "description": "..."}]`
4. Shows only the 3 fields your API provides: id, title, description

## Testing

1. Add CORS to your Flask API
2. Start your API: `python your_api.py`
3. Start CTF frontend: `npm run dev`
4. Visit: `http://localhost:9002/challenges/4`
5. Click any book
6. Check network tab - you should see the real API call!
7. Try SQL injection payloads in the URL or with tools