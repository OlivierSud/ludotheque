// backend/apps-script/Turnstile.gs

function verifyTurnstile(token, clientKey) {
  const secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (typeof token !== 'string' || token.length === 0 || !secret) return false;

  try {
    const response = UrlFetchApp.fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'post',
        payload: { secret: secret, response: token, remoteip: clientKey },
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

function getClientKey(e) {
  const headers = (e && e.headers) || {};
  const forwarded = headers['X-Forwarded-For'] || headers['x-forwarded-for'] || '';
  const ip = String(forwarded).split(',')[0].trim() || 'unknown';
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, ip);
  return digest
    .map(function (byte) {
      return (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, '0');
    })
    .join('');
}

function checkRateLimit(clientKey) {
  const cache = CacheService.getScriptCache();
  const key = 'rl:' + clientKey;
  const raw = cache.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= 20) return false;
  cache.put(key, String(count + 1), 3600);
  return true;
}

function checkTiming(startedAt) {
  if (typeof startedAt !== 'number') return false;
  const elapsed = Date.now() - startedAt;
  return elapsed >= 2000 && elapsed <= 3600000;
}
