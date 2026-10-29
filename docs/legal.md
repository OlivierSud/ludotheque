# Mentions légales & RGPD

## Obligation

Le site doit exposer, accessibles depuis toutes les pages (pied de page **et** menu Réglages) :

1. **Mentions légales** (LCEN, art. 6 III)
2. **Politique de confidentialité** (RGPD, art. 13)

Aucune collecte de données ne doit exister sans être décrite ici.

## Contenu des mentions légales

### Éditeur

| Champ                      | Valeur                                  |
| -------------------------- | --------------------------------------- |
| Nom                        | `À FOURNIR` (personne physique)         |
| Qualité                    | Particulier / éditeur non professionnel |
| Contact                    | `À FOURNIR` (adresse e-mail)            |
| Responsable de publication | `À FOURNIR`                             |

> **Demander à l'utilisateur** : nom affiché, e-mail de contact, et s'il souhaite afficher une
> adresse postale. Pour un site personnel non commercial, nom + contact suffisent en pratique ;
> valider avec lui.

### Hébergement

| Prestataire      | Rôle                             | Coordonnées                                                                     |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------- |
| GitHub, Inc.     | Hébergement des pages            | 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA — https://github.com |
| Google LLC       | Feuille de données + Apps Script | 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA — https://google.com    |
| Cloudflare, Inc. | Turnstile (anti-robot)           | 101 Townsend St, San Francisco, CA 94107, USA — https://cloudflare.com          |

### Propriété intellectuelle

- Contenus, textes et éléments graphiques : droits réservés à l'éditeur, sauf mention contraire.
- Les noms de jeux et marques cités appartiennent à leurs propriétaires respectifs.
- Les contributions des visiteurs sont publiées sous la responsabilité de leurs auteurs.

## Politique de confidentialité

### Données collectées

| Donnée                               | Finalité                                          | Base légale                  | Conservation                         |
| ------------------------------------ | ------------------------------------------------- | ---------------------------- | ------------------------------------ |
| Contenu ajouté (titre, description…) | Afficher la ludothèque                            | Consentement (envoi)         | Jusqu'à suppression                  |
| Jeton Turnstile                      | Vérifier que l'envoi vient d'un humain            | Intérêt légitime (anti-spam) | Détruit après vérification (≤ 5 min) |
| Adresse IP                           | Rate limiting (jamais stockée, hashée en mémoire) | Intérêt légitime             | ≤ 1 h, non persistée                 |
| Préférences locales (`localStorage`) | Confort d'utilisation (thème, filtres)            | Intérêt légitime             | Jusqu'au vidage du navigateur        |

**Aucun compte, aucun e-mail, aucun cookie publicitaire, aucun traceur analytique.**

### Sous-traitants et transferts

- Google (Sheets / Apps Script) et Cloudflare (Turnstile) sont situés aux États-Unis.
- Les transferts s'appuient sur les clauses contractuelles types / le cadre de protection des
  données applicable. À mentionner dans la page.

### Droits des personnes

- Accès, rectification, effacement, opposition, limitation, portabilité.
- Contact : `À FOURNIR` — réponse sous 1 mois.
- Réclamation possible auprès de la CNIL (https://www.cnil.fr).

### Suppression d'une contribution

1. Identifier la ligne dans la feuille `Jeux` (colonne `id`).
2. Supprimer la ligne.
3. Vider le cache Apps Script (`CacheService`) ou attendre 5 minutes.
4. Confirmer à la personne par e-mail.

## Cookies et stockage local

| Élément                                        | Type             | Consentement requis                           |
| ---------------------------------------------- | ---------------- | --------------------------------------------- |
| `localStorage` (préférences, cache de lecture) | Stockage local   | Non (strictement nécessaire au service)       |
| Cookies Turnstile                              | Cookie technique | Non (sécurité)                                |
| Analytics                                      | —                | **Interdit sans consentement** (et non prévu) |

Si un outil de mesure d'audience est ajouté plus tard : choisir une solution sans cookie ou
implémenter un bandeau de consentement. **Demander avant.**

## Pages à créer

| Route (à confirmer) | Contenu                                      |
| ------------------- | -------------------------------------------- |
| `/mentions-legales` | Éditeur, hébergeur, propriété intellectuelle |
| `/confidentialite`  | Données, droits, cookies, sous-traitants     |

Accès : pied de page + menu Réglages. Texte intégral dans le dépôt (composant ou Markdown
importé), pas de contenu caché derrière un PDF.

## Règles de rédaction

- Français clair, phrases courtes, pas de jargon juridique inutile.
- Dates de dernière mise à jour visibles.
- Toute nouvelle donnée collectée ⇒ mise à jour de cette page **avant** la mise en production.
- Ne jamais inventer une raison sociale, une adresse ou un numéro.

## Checklist

- [ ] Nom et e-mail de l'éditeur fournis par l'utilisateur
- [ ] Pages rédigées et accessibles (pied de page + Réglages)
- [ ] Liste des sous-traitants à jour
- [ ] Durées de conservation cohérentes avec le code
- [ ] Aucun cookie non déclaré
- [ ] Procédure de suppression testée
