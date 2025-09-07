# Claude Code Prompts: Members Portal MVP

## Project Setup Prompts

### Prompt 1: Initialize Project
"Create a new Flask web application called 'members-portal'. Set up the basic project structure with folders for templates, static files (CSS and JavaScript), and data. Include a requirements.txt file with Flask, pandas, requests, and gunicorn dependencies."

### Prompt 2: Create Sample Data
"Create a CSV file called 'members.csv' in the data folder with 6 sample member profiles. Include these columns: Name, City, Country, Class, Organization, Title, Industry, Linkedin, Image. Use diverse professional profiles with realistic data. For images, use placeholder URLs from Unsplash with face crops (150x150px). Make the profiles international with people from US, UK, Australia, Vietnam, etc."

## Backend Development Prompts

### Prompt 3: Main Flask Application
"Create the main Flask app (app.py) that reads member data from the CSV file using pandas. Include a function to add country flag emojis based on country names. Create a home route that displays all members and an API route to get individual member details for modal popups. Handle file not found errors gracefully."

### Prompt 4: Country Flag Function
"Add a function that returns appropriate flag emojis for different countries like United States (🇺🇸), United Kingdom (🇬🇧), Australia (🇦🇺), Vietnam (🇻🇳), etc. Include a fallback globe emoji for unknown countries."

## Frontend Template Prompts

### Prompt 5: Base HTML Template
"Create a base HTML template using Bootstrap 5 CDN for responsive design. Include proper meta tags, a clean title, and sections for custom CSS and JavaScript. Make it mobile-friendly and professional looking."

### Prompt 6: Main Page Template
"Create the main index page that extends the base template. Add a header section with the title 'OV Member Directory' and subtitle 'Get to know fellow members across the OV network. All information is private and for members only.' Display members in a responsive 3-column grid layout using Bootstrap cards."

### Prompt 7: Member Card Component
"Create a reusable member card component template. Each card should show a circular avatar image, member name, job title, organization, country flag with country name, LinkedIn icon link, and a 'View Profile' button. Make the cards hover-responsive with smooth animations."

### Prompt 8: Modal Popup Template
"Add a Bootstrap modal to the main page for displaying detailed member information. The modal should show a larger avatar, full member details (name, title, organization, industry, location with flag, class year), and a prominent LinkedIn connection button with the LinkedIn logo."

## Styling Prompts

### Prompt 9: Custom CSS Styling
"Create custom CSS that makes the portal look professional and modern. Style the member cards with rounded corners, subtle shadows, and hover effects. Make avatars circular with borders. Style the header with a gradient background. Ensure mobile responsiveness. Use a clean, corporate color scheme with blues and grays."

### Prompt 10: LinkedIn Integration Styling
"Style the LinkedIn logo links to be 24px icons that appear next to the View Profile buttons. In the modal, create a prominent LinkedIn connection button with the logo and 'Connect on LinkedIn' text. Make sure LinkedIn links open in new tabs."

## JavaScript Functionality Prompts

### Prompt 11: Modal JavaScript
"Create JavaScript functionality for the member profile modals. When someone clicks 'View Profile', fetch the member data from the Flask API and populate the modal with their details. Handle loading states and errors gracefully. Include image fallback handling for broken avatar URLs."

### Prompt 12: Image Fallback Handling
"Add JavaScript that creates fallback avatar images showing the person's first initial when their profile image fails to load. Use a neutral background color and white text for the fallback."

## Data Integration Prompts

### Prompt 13: CSV Data Processing
"Make the Flask app read the CSV file on startup and convert it to a format suitable for the templates. Handle missing data gracefully and ensure all fields are properly escaped for HTML display."

### Prompt 14: API Endpoint for Modal Data
"Create a Flask API route that returns individual member data as JSON when requested by member ID/index. This will be used by the JavaScript to populate the modal popups with detailed information."

## Deployment Preparation Prompts

### Prompt 15: Production Configuration
"Configure the Flask app for production deployment. Set up proper host and port configuration for cloud deployment. Ensure debug mode is disabled for production. Add error handling for missing files or data."

### Prompt 16: Deployment Files
"Create any additional files needed for deployment to free hosting platforms like Render.com or Railway.app. Ensure the requirements.txt file includes all necessary dependencies with proper versions."

## Testing and Quality Prompts

### Prompt 17: Responsive Design Testing
"Ensure the portal works perfectly on mobile devices, tablets, and desktops. Test the 3-column layout responsively collapses to 2 columns on tablets and 1 column on mobile. Verify all buttons and modals work properly on touch devices."

### Prompt 18: Error Handling and Fallbacks
"Add comprehensive error handling for missing images, broken CSV data, and network issues. Ensure the portal degrades gracefully when data is missing or corrupted. Add appropriate fallback content and user-friendly error messages."

## Final Integration Prompt

### Prompt 19: Complete Integration
"Integrate all components into a working members portal MVP. Test that the CSV data loads correctly, member cards display properly in a 3x2 grid, modals open with correct information, LinkedIn links work, and the overall user experience is smooth and professional. Ensure the design closely matches the provided screenshot reference."

## Usage Instructions

1. Run these prompts sequentially with Claude Code
2. After each prompt, review the generated code and test functionality
3. Replace the sample CSV data with your actual member data
4. Deploy to a free hosting platform like Render.com or Railway.app
5. Share the live URL with your users for feedback

## Customization Notes

- Modify the sample data in Prompt 2 to match your actual members
- Adjust styling in Prompt 9 to match your brand colors
- Add more countries to the flag function in Prompt 4 as needed
- Update the header text in Prompt 6 to match your organization's branding