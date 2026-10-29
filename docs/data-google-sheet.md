# Données — Google Sheets

## Principe

Une seule Google Sheet sert de base de données. Elle n'est **jamais** lue directement par le
navigateur : tout passe par le Web App Apps Script, qui applique validation et sécurité.

- Feuille : `Jeux` (une ligne = un jeu)
- Identifiant : UUID généré côté serveur
- Lecture : publique
- Écriture : publique mais protégée (Turnstile + validation + rate limit)

## Schéma de la feuille `Jeux`

| Colonne       | Type     | Contraintes                                     |
| ------------- | -------- | ----------------------------------------------- |
| `id`          | string   | UUID v4, généré serveur, unique                 |
| `titre`       | string   | 3–80 caractères, obligatoire                    |
| `categorie`   | enum     | Liste fermée (voir ci-dessous)                  |
| `joueurs_min` | number   | 1–20, ≤ `joueurs_max`                           |
| `joueurs_max` | number   | 1–20, ≥ `joueurs_min`                           |
| `age_min`     | number   | 0–99                                            |
| `duree_min`   | number   | 5–600 minutes                                   |
| `description` | string   | ≤ 500 caractères, texte brut                    |
| `tags`        | string   | ≤ 8 tags, séparés par `,`, chaque ≤ 20 car.     |
| `image_url`   | string   | URL `https://` optionnelle, ≤ 300 caractères    |
| `statut`      | enum     | `publie` par défaut (D-009) ; `refuse` = masqué |
| `cree_le`     | ISO 8601 | Généré serveur                                  |
| `maj_le`      | ISO 8601 | Généré serveur                                  |

Catégories autorisées (à confirmer avec la maquette) :
`Ambiance`, `Famille`, `Stratégie`, `Coopératif`, `Enfants`.

> La liste des catégories est **dupliquée** dans le frontend et dans Apps Script. Toute évolution
> doit être faite aux deux endroits, dans le même commit.

## Contrat d'API

Base : URL du Web App Apps Script (`/exec`). Réponses **toujours en HTTP 200** (contrainte Apps
Script) : le client doit lire le champ `ok`.

### Lecture — `GET ?action=list`

```json
{
  "ok": true,
  "updatedAt": "2026-11-02T10:15:00.000Z",
  "games": [
    {
      "id": "6f1c…",
      "titre": "Azul",
      "categorie": "Famille",
      "joueursMin": 2,
      "joueursMax": 4,
      "ageMin": 8,
      "dureeMin": 40,
      "description": "…",
      "tags": ["placement", "abstrait"],
      "imageUrl": "https://…"
    }
  ]
}
```

- Seules les lignes `statut = publie` sont renvoyées.
- Cache serveur `CacheService` : 5 minutes.

### Écriture — `POST` (corps `text/plain`, JSON sérialisé)

```json
{
  "action": "create",
  "token": "<jeton Turnstile>",
  "startedAt": 1762345678901,
  "website": "",
  "game": {
    "titre": "Azul",
    "categorie": "Famille",
    "joueursMin": 2,
    "joueursMax": 4,
    "ageMin": 8,
    "dureeMin": 40,
    "description": "…",
    "tags": ["placement"],
    "imageUrl": ""
  }
}
```

Réponses :

| Cas                | Réponse                                                 |
| ------------------ | ------------------------------------------------------- |
| Succès             | `{ "ok": true, "id": "…", "statut": "…" }`              |
| Turnstile invalide | `{ "ok": false, "error": "captcha" }`                   |
| Données invalides  | `{ "ok": false, "error": "validation", "fields": {…} }` |
| Trop de requêtes   | `{ "ok": false, "error": "rate_limited" }`              |
| Erreur serveur     | `{ "ok": false, "error": "server" }`                    |

`website` est un **champ piège** (honeypot) : s'il est rempli, la requête est ignorée
silencieusement. `startedAt` permet de rejeter une soumission < 2 s après l'ouverture du formulaire.

## Validation (côté serveur, obligatoire)

1. Le corps est du JSON valide, taille < 10 Ko.
2. `action === "create"`.
3. `token` non vide → vérification Turnstile.
4. Honeypot vide, délai ≥ 2 s.
5. Chaque champ : type, longueur, bornes, enum.
6. `imageUrl` : `https://` uniquement, pas de `javascript:`.
7. Nettoyage : trim, suppression des caractères de contrôle, pas de HTML.
8. `id`, `cree_le`, `maj_le`, `statut` : **jamais** fournis par le client.

Le frontend valide aussi (UX), mais **la validation serveur est la seule qui compte**.

## Rate limiting

- Clé : hash SHA-256 de l'IP (jamais l'IP en clair, jamais persistée).
- Compteur `CacheService` (TTL 1 h) : **5 écritures / heure / IP**.
- Lectures : cache 5 min, pas de limite stricte (protégée par le cache).

## Procédure de mise en place (à faire avec l'utilisateur)

1. Créer une Google Sheet nommée `Ludothèque — données`.
2. Créer la feuille `Jeux` avec les colonnes ci-dessus (ligne 1 = en-têtes).
3. `Extensions → Apps Script` → coller le contenu de `backend/apps-script/`.
4. `Paramètres du projet → Propriétés du script` :
   - `TURNSTILE_SECRET` = clé secrète Turnstile
   - `SHEET_ID` = ID de la feuille (dans l'URL)
   - `ALLOWED_ORIGINS` = `https://oliviersud.github.io,http://localhost:5173`
5. `Déployer → Nouveau déploiement → Application web` :
   - Exécuter en tant que : **moi**
   - Qui a accès : **tout le monde**
6. Copier l'URL `/exec` → `VITE_API_URL` (`.env.local` en dev, variable GitHub en prod).
7. Tester : `curl "<URL>?action=list"` doit renvoyer `{"ok":true,...}`.

> Chaque modification du code Apps Script nécessite un **nouveau déploiement** (ou « Gérer les
> déploiements → Modifier → Nouvelle version »).

## Sauvegarde et restauration

- `Fichier → Créer une copie` avant toute opération risquée.
- Export mensuel : `Fichier → Télécharger → CSV` (ou versionnage manuel).
- Ne jamais supprimer la feuille : l'application n'a pas d'autre source de vérité.

## Quotas et limites (offre gratuite)

| Ressource                 | Limite indicative                         |
| ------------------------- | ----------------------------------------- |
| Apps Script — exécution   | 6 min par exécution                       |
| Apps Script — `UrlFetch`  | ~20 000 appels/jour (compte consommateur) |
| Apps Script — temps total | ~90 min/jour                              |
| Google Sheets             | 10 M de cellules par classeur             |
| CacheService              | 6 h de TTL maximum                        |

Vérifier les valeurs officielles avant mise en production. En cas de dépassement : message clair
côté client, pas d'écran blanc.

## Questions ouvertes

- Statut par défaut : tranché (`publie`, voir D-009).
- Écran d'administration : aucun en v1 (D-010), modération dans la feuille.
- Les images sont-elles des URL externes ou des uploads (nécessiterait un autre stockage) ? (Q5)
