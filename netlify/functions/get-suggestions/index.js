const path = require('path');
const fs = require('fs').promises;

exports.handler = async () => {
  try {
    const suggestionsPath = path.resolve(__dirname, 'movie-suggestions.json');
    const data = await fs.readFile(suggestionsPath, 'utf8');
    const suggestions = JSON.parse(data);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(suggestions),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to load suggestions', details: error.message }),
    };
  }
};