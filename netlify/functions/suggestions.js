const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const query = (event.queryStringParameters.q || '').toLowerCase();

  // Use __dirname to read bundled file next to this function
  const filePath = path.join(__dirname, 'suggestions.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const suggestions = JSON.parse(raw);

  const filtered = suggestions
    .filter(title => title.toLowerCase().includes(query))
    .slice(0, 10);

  return {
    statusCode: 200,
    body: JSON.stringify(filtered),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
};
