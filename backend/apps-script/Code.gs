// backend/apps-script/Code.gs
// Routeur du Web App Apps Script. Coller ce fichier dans l'éditeur Apps Script.

const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action ? e.parameter.action : '').trim();
  if (action === 'data') {
    try {
      const payload = readAll();
      return jsonResponse({ ok: true, updatedAt: new Date().toISOString(), ...payload });
    } catch (error) {
      console.error(error);
      return jsonResponse({ ok: false, error: 'server' });
    }
  }
  return jsonResponse({ ok: false, error: 'server' });
}

function doPost(e) {
  let body = null;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (error) {
    return jsonResponse({ ok: false, error: 'validation' });
  }

  if (typeof body !== 'object' || body === null) {
    return jsonResponse({ ok: false, error: 'validation' });
  }

  // Champ piège : si rempli, on fait comme si tout allait bien (silencieux).
  if (body.website) return jsonResponse({ ok: true, id: '' });

  const clientKey = getClientKey(e);
  const action = body.action;

  if (action === 'createGame') return handleCreateGame(body, clientKey);
  if (action === 'updateGame') return handleUpdateGame(body, clientKey);
  if (action === 'createOption') return handleCreateOption(body, clientKey);

  return jsonResponse({ ok: false, error: 'validation' });
}

function jsonResponse(object) {
  // Apps Script ne supporte pas les requêtes OPTIONS (preflight CORS).
  // Le mode "Content-Type: text/plain" en POST contourne le preflight (simple request).
  // Le header Access-Control-Allow-Origin est automatiquement géré par Apps Script
  // lorsque le Web App est déployé avec accès "Tout le monde (anonyme)".
  return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
