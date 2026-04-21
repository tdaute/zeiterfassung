exports.handler = async function(event) {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygZIrqaYaERY62E6bVNJdHrMlMEGAIxd3N6hCujB4CqncbQKZy4xlj20wmeKcOOL0y/exec';

  try {
    const params = event.queryStringParameters || {};
    const qs = new URLSearchParams(params).toString();
    const url = SCRIPT_URL + '?' + qs;

    const response = await fetch(url, { method: 'GET' });
    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ status: 'error', message: err.toString() })
    };
  }
};
