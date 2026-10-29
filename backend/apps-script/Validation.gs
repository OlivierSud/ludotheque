// backend/apps-script/Validation.gs

function validateGame(jeu, criteres) {
  const fields = {};
  if (typeof jeu !== 'object' || jeu === null) {
    return { ok: false, fields: { jeu: 'invalide' } };
  }

  const nom = String(jeu.nom == null ? '' : jeu.nom).trim();
  if (nom.length === 0 || nom.length > 100) fields.nom = 'Nom invalide (1-100).';

  let lien = String(jeu.lien == null ? '' : jeu.lien).trim();
  if (lien.length > 0) {
    if (!/^https?:\/\//i.test(lien)) {
      lien = 'https://' + lien;
    } else if (/^http:\/\//i.test(lien)) {
      lien = lien.replace(/^http:\/\//i, 'https://');
    }
    if (lien.length > 500) fields.lien = 'Lien trop long (max 500 caractères).';
  }

  const critMap = {};
  (criteres || []).forEach(function (c) {
    critMap[c.id] = c;
  });

  const criteresIn = typeof jeu.criteres === 'object' && jeu.criteres !== null ? jeu.criteres : {};
  const cleaned = {};

  for (const cid in criteresIn) {
    if (!Object.prototype.hasOwnProperty.call(criteresIn, cid)) continue;
    if (!critMap[cid]) continue;

    const rawVals = criteresIn[cid];
    if (!Array.isArray(rawVals)) continue;

    const cleanedVals = [];
    for (let i = 0; i < rawVals.length; i++) {
      const val = String(rawVals[i]).trim();
      if (val && cleanedVals.indexOf(val) === -1) {
        cleanedVals.push(val);
      }
    }
    cleaned[cid] = cleanedVals;
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields: fields };
  return { ok: true, jeu: { nom: nom, lien: lien, criteres: cleaned } };
}
