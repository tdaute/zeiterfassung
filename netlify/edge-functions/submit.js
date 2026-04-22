export default async (request, context) => {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbznmXNjlkXYLllpFdgCYRktQECrp0UJ_LGPI5S6E4EivOzQsTzaQ4TyxObXSnjuRWZI/exec';
  
  const url = new URL(request.url);
  const params = url.searchParams.toString();
  
  try {
    const response = await fetch(`${SCRIPT_URL}?${params}`);
    const text = await response.text();
    
    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: err.message }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const config = { path: '/submit' };
