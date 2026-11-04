// backend/apps-script/Turnstile.gs

function verifyTurnstile(token) {
  const secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (typeof token !== 'string' || token.length === 0 || !secret) return false;

  try {
    const response = UrlFetchApp.fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'post',
        payload: { secret: secret, response: token },
        muteHttpExceptions: true,
      },
    );
    const data = JSON.parse(response.getContentText());
    return data.success === true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// L'écriture n'est jamais bloquée par un quota (D-030) : un utilisateur légitime doit toujours
// pouvoir enregistrer. La protection repose sur Turnstile, le honeypot, le délai minimal et la
// validation serveur.
function checkTiming(startedAt) {
  if (typeof startedAt !== 'number') return false;
  const elapsed = Date.now() - startedAt;
  return elapsed >= 2000 && elapsed <= 3600000;
}
