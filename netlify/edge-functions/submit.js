export default async (request, context) => {
  // Ziel 1: Google Apps Script (Sheet = Version 1)
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbznmXNjlkXYLllpFdgCYRktQECrp0UJ_LGPI5S6E4EivOzQsTzaQ4TyxObXSnjuRWZI/exec';
  // Ziel 2: Supabase Edge Function (Portal = Version 2)
  const SUPABASE_SUBMIT = 'https://yjbphyeupnjwzjjkhsih.supabase.co/functions/v1/submit';
  const SUPABASE_ANON   = 'sb_publishable_5ai62448Jal0CaSfXH7gJw_H7Bb4sut';

  const url = new URL(request.url);
  const params = url.searchParams.toString();

  // Beide Ziele parallel anschreiben. Sheet ist führend für die Antwort,
  // Supabase läuft mit; ein Fehler bei Supabase darf das Sheet nicht blockieren.
  const sheetPromise = fetch(`${SCRIPT_URL}?${params}`)
    .then(r => r.text())
    .catch(err => JSON.stringify({ status: 'sheet_error', message: String(err) }));

  const supabasePromise = fetch(`${SUPABASE_SUBMIT}?${params}`, {
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
    },
  })
    .then(r => r.text())
    .catch(err => JSON.stringify({ status: 'supabase_error', message: String(err) }));

  const [sheetText, supabaseText] = await Promise.all([sheetPromise, supabasePromise]);

  // Antwort an die App: Sheet-Text bleibt führend (wie bisher),
  // Supabase-Ergebnis wird zur Diagnose mitgegeben.
  return new Response(sheetText, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Supabase-Result': encodeURIComponent(supabaseText).slice(0, 400),
    },
  });
};

export const config = { path: '/submit' };
