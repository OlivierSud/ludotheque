# AGENTS.md — règles pour les agents IA

Point d'entrée obligatoire. **À lire intégralement avant toute action sur ce dépôt.**

## 1. Ordre de lecture

1. `AGENTS.md` (ce fichier)
2. [`docs/README.md`](docs/README.md) — index de la documentation
3. [`docs/product.md`](docs/product.md) — périmètre fonctionnel
4. [`docs/architecture.md`](docs/architecture.md) — stack et flux de données
5. [`docs/conventions.md`](docs/conventions.md) — règles de code
6. Le document thématique concerné : `design.md`, `data-google-sheet.md`, `security.md`,
   `legal.md`, `pwa.md`, `quality.md`, `deployment.md`
7. [`docs/decisions.md`](docs/decisions.md) — décisions validées et questions ouvertes
8. [`docs/roadmap.md`](docs/roadmap.md) — état d'avancement

## 2. Règles non négociables

| #   | Règle                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------ |
| R1  | **Demander avant de décider.** Aucun choix structurant sans validation (voir §3).                                        |
| R2  | **100 % gratuit.** Toute techno ajoutée doit être gratuite et le rester à l'usage.                                       |
| R3  | **Respecter la maquette.** Aucune invention visuelle ; tout écart doit être approuvé.                                    |
| R4  | **PC + mobile.** Chaque écran est livré dans les deux formats, testé aux deux.                                           |
| R5  | **PWA proposée dans le menu Réglages**, jamais en bannière automatique.                                                  |
| R6  | **Données utilisateur dans Google Sheets**, via Apps Script (jamais de clé côté client).                                 |
| R7  | **Turnstile sur toute écriture**, vérifié côté serveur.                                                                  |
| R8  | **Aucune authentification** pour lire ou ajouter des données.                                                            |
| R9  | **Mentions légales + confidentialité** accessibles depuis l'application.                                                 |
| R10 | **Mettre à jour le README et `docs/`** à chaque changement de règle, de dépendance ou de périmètre, dans le même commit. |
| R11 | **Aucun secret dans le dépôt** (clés Turnstile secrètes, ID privés, tokens).                                             |
| R12 | **Utiliser Graphify, Ponytail et les skills** selon [`docs/ai-workflow.md`](docs/ai-workflow.md).                        |
| R13 | **Signaler ce qui n'a pas été fait** (non testé, non vérifié, dette laissée).                                            |

## 3. Protocole « demander avant »

Une validation est **obligatoire** avant :

- ajouter, retirer ou remplacer une dépendance ou un service ;
- modifier le schéma de la Google Sheet ou le contrat de l'API ;
- modifier la stratégie de sécurité (Turnstile, validation, rate limit) ;
- choisir un routeur, une gestion d'état, un mode de styling ;
- s'écarter de la maquette (espacement, couleur, composant, wording) ;
- ajouter une fonctionnalité non listée dans `docs/product.md` ;
- changer le périmètre, la cible ou le modèle de données.

Format attendu :

```
Question : <décision à prendre>
Options : A (recommandé) — conséquences / B — conséquences
Recommandation : <option> parce que <raison courte>
Bloquant : oui/non
```

Ne jamais choisir « pour avancer » puis prévenir après coup.

## 4. Définition de « terminé »

- [ ] Conforme à la maquette (mobile + desktop) et à `docs/product.md`
- [ ] Types stricts, aucun `any`, validation aux frontières
- [ ] `npm run format && npm run lint && npm run typecheck && npm run test && npm run build` verts
- [ ] Testé manuellement : mobile, desktop, cas vide, cas erreur, réseau coupé (si PWA)
- [ ] Accessibilité : clavier, contrastes, labels, focus visible
- [ ] README / docs mis à jour ; décision consignée dans `docs/decisions.md`
- [ ] Aucun secret, aucune donnée personnelle en clair dans le dépôt

## 5. Ce qu'il ne faut pas faire

- Installer une dépendance « au cas où » ou pour quelques lignes (voir Ponytail).
- Écrire un accès Google Sheets depuis le navigateur avec une clé ou un compte de service.
- Ajouter un service payant, une offre d'essai ou un quota qui expire.
- Créer une interface parallèle ou un « écran de test » non validé.
- Laisser un `console.log`, un `TODO` sans ticket, ou du code mort.
- Modifier `dist/`, `sw.js` ou `manifest.webmanifest` générés.
