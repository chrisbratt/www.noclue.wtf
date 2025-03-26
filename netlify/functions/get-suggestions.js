const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // Read suggestions from JSON file
        const suggestionsPath = path.join(__dirname, '../../data/movie-suggestions.json');
        const suggestions = JSON.parse(fs.readFileSync(suggestionsPath, 'utf8'));

        return {
            statusCode: 200,
            body: JSON.stringify(suggestions)
        };
    } catch (error) {
        console.error('Error loading suggestions:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to load suggestions' })
        };
    }
};
