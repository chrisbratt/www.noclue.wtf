const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const query = (event.queryStringParameters.q || '').toLowerCase();

  // Read suggestions.json relative to the function file (bundled with it)
  const filePath = path.join(__dirname, 'suggestions.json'); // 👈 FIXED
  const raw = fs.readFileSync(filePath, 'utf-8');
  const suggestions = JSON.parse(raw);

  const filtered = suggestions
    .filter(title => title.toLowerCase().includes(query))
    .slice(0, 10);

  return {
    statusCode: 200,
    body: JSON.stringify(filtered),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};
