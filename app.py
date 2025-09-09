from flask import Flask, render_template, jsonify, request
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

def load_member_data():
    """Load member data from CSV file"""
    csv_path = os.path.join('data', 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTRr1k0NqIievUlo3BU84irBXwNtAOv_cpNY5cu1KSVMl4FzzHpQ63mUqo5J8ToylfCf9cgOfzeU3xz/pub?gid=0&single=true&output=csv')
    try:
        df = pd.read_csv(csv_path)
        return df.to_dict('records')
    except FileNotFoundError:
        # Fallback sample data if CSV not found
        return []

def get_country_flag(country):
    """Get country flag emoji"""
    flags = {
        'United States': '🇺🇸',
        'Australia': '🇦🇺', 
        'United Kingdom': '🇬🇧',
        'Vietnam': '🇻🇳',
        'Việt Nam': '🇻🇳',
        'USA': '🇺🇸',
        'France': '🇫🇷',
        'Canada': '🇨🇦'
    }
    return flags.get(country, '🌐')

def clean_nan_values(data):
    """Convert NaN values to empty strings for JSON serialization"""
    if isinstance(data, list):
        return [clean_nan_values(item) for item in data]
    elif isinstance(data, dict):
        cleaned = {}
        for key, value in data.items():
            if pd.isna(value) or (isinstance(value, float) and np.isnan(value)):
                cleaned[key] = ''
            else:
                cleaned[key] = value
        return cleaned
    else:
        return data

def filter_members(members, filters):
    """Filter members based on search criteria"""
    filtered = []
    
    for member in members:
        # Check each filter condition
        if filters.get('name') and filters['name'].lower() not in member.get('Name', '').lower():
            continue
        if filters.get('city') and filters['city'] != member.get('City', ''):
            continue
        if filters.get('country') and filters['country'] != member.get('Country', ''):
            continue
        if filters.get('class') and filters['class'] != member.get('Class', ''):
            continue
        if filters.get('title') and filters['title'].lower() not in member.get('Title', '').lower():
            continue
        if filters.get('industry') and filters['industry'] != member.get('Industry', ''):
            continue
        
        filtered.append(member)
    
    return filtered

def get_unique_values(members, field):
    """Get unique values for dropdown options"""
    values = set()
    for member in members:
        value = member.get(field, '').strip()
        if value:
            values.add(value)
    return sorted(list(values))

@app.route('/')
def index():
    members = load_member_data()
    # Add country flags to member data
    for member in members:
        member['flag'] = get_country_flag(member.get('Country', ''))
    
    # Get unique values for dropdowns
    countries = get_unique_values(members, 'Country')
    cities = get_unique_values(members, 'City')
    classes = get_unique_values(members, 'Class')
    industries = get_unique_values(members, 'Industry')
    
    return render_template('index.html', 
                         members=members,
                         countries=countries,
                         cities=cities,
                         classes=classes,
                         industries=industries)

@app.route('/member/<int:member_id>')
def get_member(member_id):
    """API endpoint to get member details for modal"""
    members = load_member_data()
    if 0 <= member_id < len(members):
        member = members[member_id].copy()  # Create a copy to avoid modifying original
        member['flag'] = get_country_flag(member.get('Country', ''))
        # Clean NaN values before sending JSON response
        cleaned_member = clean_nan_values(member)
        return jsonify(cleaned_member)
    return jsonify({'error': 'Member not found'}), 404

@app.route('/api/search')
def search_members():
    """API endpoint for searching members"""
    # Get search parameters
    filters = {
        'name': request.args.get('name', '').strip(),
        'city': request.args.get('city', '').strip(),
        'country': request.args.get('country', '').strip(),
        'class': request.args.get('class', '').strip(),
        'title': request.args.get('title', '').strip(),
        'industry': request.args.get('industry', '').strip()
    }
    
    # Remove empty filters
    filters = {k: v for k, v in filters.items() if v}
    
    # Load and filter members
    members = load_member_data()
    filtered_members = filter_members(members, filters)
    
    # Add flags and clean NaN values
    for member in filtered_members:
        member['flag'] = get_country_flag(member.get('Country', ''))
    
    # Clean NaN values in all members before JSON response
    cleaned_members = clean_nan_values(filtered_members)
    
    return jsonify({
        'members': cleaned_members,
        'total_count': len(members),
        'filtered_count': len(filtered_members)
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)