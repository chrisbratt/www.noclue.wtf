const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // Use absolute path to ensure correct file location
        const suggestionsPath = path.resolve(__dirname, '../../data/movie-suggestions.json');
        
        // Log the exact path being used
        console.log('Suggestions file path:', suggestionsPath);

        // Read suggestions file
        const suggestionsData = await fs.readFile(suggestionsPath, 'utf8');
        const suggestions = JSON.parse(suggestionsData);

        // Log the suggestions to verify content
        console.log('Loaded suggestions:', suggestions.length);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(suggestions)
        };
    } catch (error) {
        console.error('Error in get-suggestions function:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: 'Failed to load suggestions', 
                details: error.message,
                stack: error.stack 
            })
        };
    }
};