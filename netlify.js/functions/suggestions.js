const suggestions = require('./suggestions.json');

exports.handler = async (event) => {
  const query = (event.queryStringParameters.q || '').toLowerCase();

  const filtered = suggestions
    .filter(title => title.toLowerCase().includes(query))
    .slice(0, 10); // Return top 10

  return {
    statusCode: 200,
    body: JSON.stringify(filtered),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};
