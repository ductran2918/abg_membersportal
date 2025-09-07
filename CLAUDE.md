# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **ABG Alumni Directory** - a Flask web application for displaying and searching member profiles. It's a members portal MVP that allows users to browse alumni profiles with search and filtering capabilities.

### Architecture

- **Backend**: Flask application (`app.py`) using pandas for CSV data processing
- **Data Source**: CSV file at `data/members.csv` containing member profiles  
- **Frontend**: Jinja2 templates with Bootstrap 5 for responsive UI
- **Static Assets**: Custom CSS (`static/css/style.css`) and JavaScript (`static/js/main.js`)

### Key Components

- `app.py`: Main Flask application with member data loading, filtering, and API endpoints
- `templates/index.html`: Main directory page with search interface and member cards
- `templates/base.html`: Base template with Bootstrap CDN integration
- `data/members.csv`: Member profile data (Name, City, Country, Class, Organization, Title, Industry, LinkedIn, Image)

## Development Commands

### Running the Application
```bash
# Install dependencies
pip install -r requirements.txt

# Run development server  
python app.py
# Server runs on http://localhost:5000
```

### Production Deployment
```bash
# Using gunicorn (production server included in requirements)
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Key Functionality

### Data Processing
- `load_member_data()`: Loads and processes CSV data with pandas
- `clean_nan_values()`: Handles NaN/null values for JSON serialization  
- `filter_members()`: Implements search filtering across multiple fields
- `get_country_flag()`: Maps country names to flag emojis

### API Endpoints
- `GET /`: Main directory page with all members
- `GET /member/<int:member_id>`: Individual member details (JSON)
- `GET /api/search`: Search API with filtering parameters

### Frontend Features
- Responsive 3-column member card layout
- Bootstrap modal popups for member details
- Real-time search with multiple filter criteria
- Country flag emoji display
- LinkedIn profile integration

## Architecture Notes

### Search Implementation
The search system uses simultaneous filtering across:
- Name (text search)
- City (dropdown selection)  
- Country (dropdown selection)
- Class (dropdown selection)
- Title (text search)
- Industry (dropdown selection)

### Data Flow
1. CSV data loaded via pandas on app startup
2. Flask routes serve both HTML pages and JSON API responses
3. Frontend JavaScript handles modal interactions and search
4. Bootstrap provides responsive UI components

### File Structure
```
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── data/
│   ├── members.csv       # Member profile data
│   └── prompt_plan.md    # Development prompts/planning
├── templates/
│   ├── base.html         # Base template
│   ├── index.html        # Main directory page
│   └── components/       # Reusable template components
├── static/
│   ├── css/style.css     # Custom styling
│   └── js/main.js        # Frontend interactions
└── .github/workflows/    # GitHub Pages deployment
```

## Current Known Issues (from prompt.md)
1. Country display should show City instead on cards
2. City search needs dropdown format like Country  
3. Modal popups failing for entries with null data
4. Search should update results immediately when input deleted
5. "Clear all filters" button not properly resetting page