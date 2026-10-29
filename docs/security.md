# Sécurité

## Modèle de menace

L'application **n'a pas d'authentification** : n'importe qui peut lire et proposer un jeu. Les
risques principaux sont donc :

| Risque                           | Contre-mesure                                      |
| -------------------------------- | -------------------------------------------------- |
| Spam / bot remplissant la sheet  | Cloudflare Turnstile + honeypot + délai minimal    |
| Flood (déni de quota)            | Rate limit par IP hashée + cache de lecture        |
| Injection de contenu (HTML/JS)   | Validation stricte, rendu texte uniquement (React) |
| Fuite de secret                  | Secret uniquement dans les Script Properties       |
| Vandalisme / contenu inapproprié | Suppression manuelle dans la feuille (D-009)       |
| Fuite de données personnelles    | Collecte minimale, pas d'IP stockée, pas de compte |

## Cloudflare Turnstile

### Principe

Turnstile remplace un captcha par un défi invisible ou interactif. Il produit un **jeton à usage
unique**, valable 300 s, vérifié **côté serveur** avec la clé secrète.

```
Formulaire ──▶ widget Turnstile ──▶ jeton
                                     │
POST (jeu + jeton) ─────────────────▶ Apps Script
                                     │
                                     ├─▶ POST siteverify (secret + jeton)
                                     │      ↳ Cloudflare : success / error-codes
                                     └─▶ si success → écriture dans la sheet
```

### Configuration (à faire avec l'utilisateur)

1. Créer un compte Cloudflare (gratuit) → `Turnstile` → `Add site`.
2. Nom : `Ludothèque`.
3. Domaines : `oliviersud.github.io` **et** `localhost`.
4. Widget mode : **Invisible** (totalement invisible pour les utilisateurs).
5. Récupérer :
   - **Site Key** (publique) → `VITE_TURNSTILE_SITE_KEY`
   - **Secret Key** → propriété de script `TURNSTILE_SECRET` (jamais dans le dépôt)
6. En développement, utiliser les **clés de test officielles** de Cloudflare (documentées) pour ne
   pas polluer les statistiques.

### Vérification côté serveur

```js
// Apps Script — turnstile.gs
function verifyTurnstile(token, remoteIp) {
  const res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: {
      secret: PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET'),
      response: token,
      remoteip: remoteIp,
    },
    muteHttpExceptions: true,
  });
  const data = JSON.parse(res.getContentText());
  return data.success === true;
}
```

Règles :

- Ne **jamais** faire confiance au client (« le widget a dit OK »).
- Vérifier `success`, et si possible `hostname` et `action`.
- Un jeton ne peut servir qu'**une fois** : ne pas le mettre en cache.
- En cas d'échec de `siteverify` (réseau), refuser l'écriture (`fail closed`).

## Édition publique (D-015)

- Toute écriture (ajout, modification, ajout d'option) exige un jeton Turnstile valide.
- Rate limit : 20 écritures/heure/IP (best-effort : Apps Script n'expose pas toujours l'IP du
  visiteur ; le compteur peut alors être global).
- Aucune suppression depuis l'interface : modération manuelle dans la feuille.
- Le propriétaire doit surveiller la feuille et supprimer les lignes indésirables.

| Secret                    | Où il vit                          | Visible client |
| ------------------------- | ---------------------------------- | -------------- |
| `TURNSTILE_SECRET`        | Apps Script → Propriétés du script | Non            |
| `SHEET_ID`                | Apps Script → Propriétés du script | Non            |
| `VITE_API_URL`            | Variable GitHub / `.env.local`     | Oui (normal)   |
| `VITE_TURNSTILE_SITE_KEY` | Variable GitHub / `.env.local`     | Oui (normal)   |

- `.env*` est ignoré par Git ; fournir un `.env.example` sans valeur.
- Un secret exposé doit être **révoqué et régénéré**, pas seulement retiré du code.

## Validation et assainissement

- Toute entrée est validée côté serveur (type, longueur, bornes, enum).
- React échappe le texte par défaut : **interdiction** de `dangerouslySetInnerHTML`.
- Les URL d'image sont restreintes à `https://`.
- Taille maximale du corps : 10 Ko.
- Rejeter les champs inconnus plutôt que les ignorer silencieusement.

## CORS et appels

- Apps Script ne répond pas aux `OPTIONS` : envoyer les POST en
  `Content-Type: text/plain;charset=utf-8` (requête simple, sans preflight).
- Parser le corps manuellement côté serveur (`JSON.parse(e.postData.contents)`).
- En cas de blocage CORS persistant, intercaler un **Cloudflare Worker** gratuit
  (100 000 requêtes/jour) qui ajoute les en-têtes et relaie vers Apps Script.
- Ne jamais utiliser `mode: 'no-cors'` (réponse illisible, échecs silencieux).

## En-têtes de sécurité

GitHub Pages ne permet pas de définir des en-têtes HTTP personnalisés. Mitigations possibles :

- `<meta http-equiv="Content-Security-Policy" …>` dans `index.html` (CSP partielle, pas de
  `frame-ancestors`).
- `Referrer-Policy` et `Permissions-Policy` via balises `meta` lorsque supportées.
- Ne pas embarquer de script tiers non maîtrisé (Turnstile excepté).

Toute CSP doit autoriser : `challenges.cloudflare.com` (`script-src`, `frame-src`, `connect-src`)
et l'URL Apps Script (`connect-src`).

## Journalisation et surveillance

- Apps Script : `console.log` consultable dans `Exécutions` (ne jamais y écrire de données
  personnelles).
- Cloudflare : tableau de bord Turnstile (taux de réussite, blocages).
- GitHub Actions : échecs de build/déploiement.
- Prévoir un signal simple : si le nombre d'ajouts chute à zéro alors que le trafic existe,
  vérifier Turnstile et les quotas.

## Checklist avant mise en production

- [ ] Turnstile activé sur les deux domaines (prod + localhost)
- [ ] Secret uniquement dans les Script Properties
- [ ] Validation serveur testée avec des payloads invalides
- [ ] Honeypot et délai minimal testés
- [ ] Rate limit testé (6e requête refusée)
- [ ] Aucun `console.log` de données sensibles
- [ ] Mentions légales et confidentialité publiées
- [ ] Procédure de suppression d'une ligne documentée
