# Données — Google Sheets

## Principe

Deux onglets servent de base de données (décision D-018). Ils sont **lus à l'exécution** (aucune donnée
codée en dur dans le bundle) et **jamais** interrogés directement par le navigateur : tout passe
par le Web App Apps Script, qui applique validation et sécurité.

| Onglet     | Rôle                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------- |
| `jeux`     | Un jeu par ligne avec `Nom`, `Site` et une colonne par critère (listes déroulantes)         |
| `criteres` | Une colonne par type de critère (`Format`, `Mécanique de jeu`…), options listées en dessous |

Ajouter un critère (nouvelle colonne) ou une option (nouvelle valeur sous le critère) dans la feuille suffit :
l'interface les affiche au prochain chargement, sans redéploiement.

## Schéma

### `jeux`

| Colonne            | Type   | Contraintes                                                   |
| ------------------ | ------ | ------------------------------------------------------------- |
| `Nom`              | string | 1–100 caractères, obligatoire                                 |
| `Site` (ou `Lien`) | string | URL `https://` (≤ 500), ou vide                               |
| `<Nom du Critère>` | string | Options sélectionnées, séparées par des virgules si multiples |

L'identifiant (`id`) du jeu utilisé par l'API correspond au numéro de ligne réel dans la feuille (ex. `"2"`, `"3"`).

### `criteres`

| Colonne           | Type   | Description                                                                |
| ----------------- | ------ | -------------------------------------------------------------------------- |
| En-tête (ligne 1) | string | Nom du critère (ex. `Format`, `Mécanique de jeu`, `Objectif pédagogique`…) |
| Lignes 2..N       | string | Options disponibles pour ce critère (ex. `individuel`, `binôme`…)          |
| `couleurs` (opt.) | string | Palette de couleurs indicative                                             |

## Contrat d'API

Base : URL du Web App Apps Script (`/exec`). Réponses **toujours en HTTP 200** (contrainte Apps
Script) : le client doit lire le champ `ok`.

### Lecture — `GET ?action=data`

```json
{
  "ok": true,
  "updatedAt": "2026-10-29T12:00:00.000Z",
  "criteres": [
    {
      "id": "matiere",
      "nom": "Matière",
      "ordre": 1,
      "multiple": true,
      "options": [
        { "id": "opt-1", "libelle": "Mathématiques", "couleur": "teal", "ordre": 1 },
        { "id": "opt-2", "libelle": "Français", "couleur": "pink", "ordre": 2 }
      ]
    }
  ],
  "jeux": [
    {
      "id": "6f1c…",
      "nom": "Jeu de Mathématiques",
      "lien": "https://exemple.com",
      "criteres": { "matiere": ["opt-1"], "niveau": ["opt-9"] }
    }
  ]
}
```

Cache serveur `CacheService` : 5 minutes.

### Écriture — `POST` (corps `text/plain`, JSON sérialisé)

Commun à toutes les actions :

```json
{
  "action": "createGame | updateGame | createOption",
  "token": "<jeton Turnstile>",
  "startedAt": 1762345678901,
  "website": ""
}
```

| Action         | Champs supplémentaires               |
| -------------- | ------------------------------------ |
| `createGame`   | `jeu: { nom, lien, criteres }`       |
| `updateGame`   | `id`, `jeu: { nom, lien, criteres }` |
| `createOption` | `critereId`, `libelle`, `couleur`    |

`criteres` est un objet `{ "<critereId>": ["<optionId>", …] }`.

Réponses :

| Cas                | Réponse                                                   |
| ------------------ | --------------------------------------------------------- |
| Succès             | `{ "ok": true, "id": "…" }`                               |
| Turnstile invalide | `{ "ok": false, "error": "captcha" }`                     |
| Données invalides  | `{ "ok": false, "error": "validation", "fields": { … } }` |
| Trop de requêtes   | `{ "ok": false, "error": "rate_limited" }`                |
| Introuvable        | `{ "ok": false, "error": "not_found" }`                   |
| Erreur serveur     | `{ "ok": false, "error": "server" }`                      |

`website` est un **champ piège** : rempli ⇒ requête ignorée silencieusement.
`startedAt` : soumission refusée si < 2 s après l'ouverture du formulaire.

## Validation (serveur, obligatoire)

1. JSON valide, corps < 10 Ko.
2. `action` connue.
3. `token` vérifié par Turnstile (`success === true`).
4. Honeypot vide, délai ≥ 2 s.
5. `nom` : 1–100 caractères, sans caractère de contrôle.
6. `lien` : vide ou `https://`, ≤ 500 caractères.
7. `criteres` : clés = ids connus ; valeurs = ids d'options appartenant au critère ; si
   `multiple = FALSE`, au plus une option.
8. `libelle` (nouvelle option) : 1–40 caractères.
9. `couleur` : clé de palette autorisée.
10. `id`, `cree_le`, `maj_le` : **jamais** fournis par le client.

Le client valide aussi (UX), mais **la validation serveur fait foi**.

## Écritures

- `createGame` : ajoute une ligne dans `Jeux`, puis les lignes de `JeuxCriteres`.
- `updateGame` : met à jour `nom`, `lien`, `maj_le`, puis **remplace** les lignes de
  `JeuxCriteres` du jeu (suppression + ajout dans le même appel).
- `createOption` : ajoute une ligne dans `Options` (ordre = max + 1).

Toute écriture invalide ne modifie **rien**.

## Rate limiting

- Clé : hash SHA-256 de l'IP (jamais l'IP en clair, jamais persistée).
- `CacheService`, TTL 1 h : **20 écritures / heure / IP**.
- Lecture : cache 5 min.

## Palette autorisée

| Clé      | Couleur | Contraste texte |
| -------- | ------- | --------------- |
| `olive`  | #4B6A4A | blanc           |
| `blue`   | #005B9F | blanc           |
| `teal`   | #00959F | blanc           |
| `purple` | #8B73A3 | blanc           |
| `pink`   | #F26D7D | blanc           |
| `yellow` | #FFC222 | #2B2B2B         |
| `orange` | #E25822 | blanc           |

Une couleur inconnue retombe sur `blue` côté client.

## Procédure de mise en place (à faire avec l'utilisateur)

1. Créer une Google Sheet `Ludothèque — données`.
2. Créer les 4 feuilles avec la ligne d'en-têtes ci-dessus.
3. Remplir `Criteres` et `Options` (au moins un critère et deux options).
4. `Extensions → Apps Script` → coller les fichiers de `backend/apps-script/`.
5. Propriétés du script :
   - `TURNSTILE_SECRET` = clé secrète Turnstile
   - `SHEET_ID` = ID de la feuille (dans l'URL)
   - `ALLOWED_ORIGINS` = `https://oliviersud.github.io,http://localhost:5173`
6. `Déployer → Nouveau déploiement → Application web` :
   - Exécuter en tant que : **moi**
   - Qui a accès : **tout le monde**
7. Copier l'URL `/exec` → `VITE_API_URL`.
8. Vérifier : `GET <URL>?action=data` renvoie `{ "ok": true, … }`.

> Chaque modification du code Apps Script nécessite un **nouveau déploiement**.

## Sauvegarde et quotas

- `Fichier → Créer une copie` avant toute opération risquée ; export CSV mensuel.
- Quotas indicatifs : 6 min par exécution, ~20 000 `UrlFetch`/jour, ~90 min/jour, cache 6 h max.
- Dépassement ⇒ message clair côté client, jamais d'écran blanc.

## Questions ouvertes

- Suppression d'un jeu ou d'une option depuis l'interface ? (non prévue en v1)
- Historique des modifications (qui/quand) en cas de vandalisme ? (Q13)
