// backend/apps-script/Sheets.gs
// Gestion de la lecture et de l'écriture dans les 2 onglets "jeux" et "criteres".

const ALLOWED_COLORS = ['olive', 'blue', 'teal', 'purple', 'pink', 'yellow', 'orange'];

function getSheetCaseInsensitive(ss, targetName) {
  const sheets = ss.getSheets();
  const targetNorm = targetName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  for (let i = 0; i < sheets.length; i++) {
    const sName = sheets[i]
      .getName()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (sName === targetNorm) {
      return sheets[i];
    }
  }
  return null;
}

function getCriteriaSheet(ss) {
  return getSheetCaseInsensitive(ss, 'criteres');
}

function getGamesSheet(ss) {
  return getSheetCaseInsensitive(ss, 'jeux');
}

function readCriteria(critSheet) {
  if (!critSheet) return [];
  const lastCol = critSheet.getLastColumn();
  const lastRow = critSheet.getLastRow();
  if (lastCol < 1 || lastRow < 1) return [];

  const values = critSheet.getRange(1, 1, lastRow, lastCol).getValues();
  if (values.length < 1) return [];

  const headers = values[0].map(function (h) {
    return String(h || '').trim();
  });
  const criteres = [];

  for (let colIdx = 0; colIdx < headers.length; colIdx++) {
    const headerName = headers[colIdx];
    if (!headerName || headerName.toLowerCase() === 'couleurs') continue;

    const options = [];
    for (let rowIdx = 1; rowIdx < values.length; rowIdx++) {
      const cellVal = String(values[rowIdx][colIdx] || '')
        .replace(/^["'\s]+|["'\s,]+$/g, '')
        .trim();
      if (cellVal.length > 0) {
        options.push({
          id: cellVal,
          libelle: cellVal,
          couleur: ALLOWED_COLORS[criteres.length % ALLOWED_COLORS.length],
          ordre: options.length + 1,
        });
      }
    }

    criteres.push({
      id: headerName,
      nom: headerName,
      ordre: criteres.length + 1,
      multiple: true,
      options: options,
    });
  }

  return criteres;
}

function readGames(jeuSheet, criteres) {
  if (!jeuSheet) return [];
  const lastCol = jeuSheet.getLastColumn();
  const lastRow = jeuSheet.getLastRow();
  if (lastCol < 1 || lastRow < 2) return [];

  const values = jeuSheet.getRange(1, 1, lastRow, lastCol).getValues();
  const headers = values[0].map(function (h) {
    return String(h || '').trim();
  });

  let nomCol = -1;
  let siteCol = -1;
  const critColMap = {};

  for (let c = 0; c < headers.length; c++) {
    const h = headers[c];
    const hNorm = h
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (hNorm === 'nom' && nomCol === -1) {
      nomCol = c;
    } else if ((hNorm === 'site' || hNorm === 'lien') && siteCol === -1) {
      siteCol = c;
    } else {
      critColMap[h] = c;
    }
  }

  const jeux = [];
  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const nom = nomCol !== -1 ? String(row[nomCol] || '').trim() : '';
    if (!nom) continue;

    const lien = siteCol !== -1 ? String(row[siteCol] || '').trim() : '';
    const gameCriteres = {};

    criteres.forEach(function (crit) {
      const colIdx = critColMap[crit.id];
      if (colIdx !== undefined && colIdx !== -1) {
        const rawCell = String(row[colIdx] || '').trim();
        if (rawCell) {
          const parts = rawCell
            .split(/[,;\n]+/)
            .map(function (p) {
              return p.replace(/^["'\s]+|["'\s,]+$/g, '').trim();
            })
            .filter(Boolean);
          if (parts.length > 0) {
            gameCriteres[crit.id] = parts;
          }
        }
      }
    });

    jeux.push({
      id: String(r + 1), // numéro de ligne réel dans la feuille
      nom: nom,
      lien: lien,
      criteres: gameCriteres,
    });
  }

  return jeux;
}

function readAll() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const critSheet = getCriteriaSheet(ss);
  const jeuSheet = getGamesSheet(ss);
  if (!critSheet || !jeuSheet) {
    throw new Error('Feuilles "jeux" ou "criteres" introuvables.');
  }

  const criteres = readCriteria(critSheet);
  const jeux = readGames(jeuSheet, criteres);

  return { criteres: criteres, jeux: jeux };
}

function handleCreateGame(body, clientKey) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const jeuSheet = getGamesSheet(ss);
  const critSheet = getCriteriaSheet(ss);
  if (!jeuSheet || !critSheet) {
    return jsonResponse({ ok: false, error: 'server' });
  }

  const criteres = readCriteria(critSheet);
  const validation = validateGame(body.jeu, criteres);
  if (!validation.ok) {
    return jsonResponse({ ok: false, error: 'validation', fields: validation.fields });
  }
  if (!verifyTurnstile(body.token, clientKey)) {
    return jsonResponse({ ok: false, error: 'captcha' });
  }
  if (!checkRateLimit(clientKey)) {
    return jsonResponse({ ok: false, error: 'rate_limited' });
  }
  if (!checkTiming(body.startedAt)) {
    return jsonResponse({ ok: false, error: 'validation' });
  }

  const lastCol = Math.max(jeuSheet.getLastColumn(), 1);
  const headers = jeuSheet
    .getRange(1, 1, 1, lastCol)
    .getValues()[0]
    .map(function (h) {
      return String(h || '').trim();
    });

  const rowData = new Array(headers.length).fill('');
  for (let c = 0; c < headers.length; c++) {
    const h = headers[c];
    const hNorm = h
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (hNorm === 'nom') {
      rowData[c] = validation.jeu.nom;
    } else if (hNorm === 'site' || hNorm === 'lien') {
      rowData[c] = validation.jeu.lien;
    } else if (validation.jeu.criteres[h]) {
      rowData[c] = validation.jeu.criteres[h].join(', ');
    }
  }

  jeuSheet.appendRow(rowData);
  const newRowId = String(jeuSheet.getLastRow());

  return jsonResponse({ ok: true, id: newRowId });
}

function handleUpdateGame(body, clientKey) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const jeuSheet = getGamesSheet(ss);
  const critSheet = getCriteriaSheet(ss);
  if (!jeuSheet || !critSheet) {
    return jsonResponse({ ok: false, error: 'server' });
  }

  const rowIndex = parseInt(body.id, 10);
  if (isNaN(rowIndex) || rowIndex < 2 || rowIndex > jeuSheet.getLastRow()) {
    return jsonResponse({ ok: false, error: 'not_found' });
  }

  const criteres = readCriteria(critSheet);
  const validation = validateGame(body.jeu, criteres);
  if (!validation.ok) {
    return jsonResponse({ ok: false, error: 'validation', fields: validation.fields });
  }
  if (!verifyTurnstile(body.token, clientKey)) {
    return jsonResponse({ ok: false, error: 'captcha' });
  }
  if (!checkRateLimit(clientKey)) {
    return jsonResponse({ ok: false, error: 'rate_limited' });
  }
  if (!checkTiming(body.startedAt)) {
    return jsonResponse({ ok: false, error: 'validation' });
  }

  const lastCol = Math.max(jeuSheet.getLastColumn(), 1);
  const headers = jeuSheet
    .getRange(1, 1, 1, lastCol)
    .getValues()[0]
    .map(function (h) {
      return String(h || '').trim();
    });

  for (let c = 0; c < headers.length; c++) {
    const h = headers[c];
    const hNorm = h
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    let val = null;
    if (hNorm === 'nom') {
      val = validation.jeu.nom;
    } else if (hNorm === 'site' || hNorm === 'lien') {
      val = validation.jeu.lien;
    } else if (validation.jeu.criteres[h]) {
      val = validation.jeu.criteres[h].join(', ');
    }
    if (val !== null) {
      jeuSheet.getRange(rowIndex, c + 1).setValue(val);
    }
  }

  return jsonResponse({ ok: true, id: body.id });
}

function handleCreateOption(body, clientKey) {
  const critereId = String(body.critereId == null ? '' : body.critereId).trim();
  const libelle = String(body.libelle == null ? '' : body.libelle).trim();

  const fields = {};
  if (libelle.length === 0 || libelle.length > 40) fields.libelle = 'Libellé invalide (1-40).';

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const critSheet = getCriteriaSheet(ss);
  if (!critSheet) return jsonResponse({ ok: false, error: 'server' });

  const lastCol = Math.max(critSheet.getLastColumn(), 1);
  const headers = critSheet
    .getRange(1, 1, 1, lastCol)
    .getValues()[0]
    .map(function (h) {
      return String(h || '').trim();
    });

  const colIdx = headers.indexOf(critereId);
  if (colIdx === -1) fields.critereId = 'Critère inconnu.';

  if (Object.keys(fields).length > 0) {
    return jsonResponse({ ok: false, error: 'validation', fields: fields });
  }
  if (!verifyTurnstile(body.token, clientKey)) {
    return jsonResponse({ ok: false, error: 'captcha' });
  }
  if (!checkRateLimit(clientKey)) {
    return jsonResponse({ ok: false, error: 'rate_limited' });
  }
  if (!checkTiming(body.startedAt)) {
    return jsonResponse({ ok: false, error: 'validation' });
  }

  const lastRow = Math.max(critSheet.getLastRow(), 1);
  const colValues = critSheet.getRange(1, colIdx + 1, lastRow, 1).getValues();
  let targetRow = colValues.length + 1;
  for (let r = 1; r < colValues.length; r++) {
    if (!colValues[r][0]) {
      targetRow = r + 1;
      break;
    }
  }

  critSheet.getRange(targetRow, colIdx + 1).setValue(libelle);

  return jsonResponse({ ok: true, id: libelle, ordre: targetRow });
}
