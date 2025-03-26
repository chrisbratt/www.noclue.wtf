const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
    try {
        const suggestionsPath = path.resolve(__dirname, 'movie-suggestions.json');
        const suggestionsData = await fs.readFile(suggestionsPath, 'utf8');
        const suggestions = JSON.parse(suggestionsData);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(suggestions)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Failed to load suggestions',
                details: error.message
            })
        };
    }
};