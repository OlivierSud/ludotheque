---
name: ludotheque
description: >
  Règles du projet Ludothèque : protocole « demander avant », gratuité, respect de la maquette,
  Google Sheets + Apps Script, Turnstile, PWA dans les Réglages, mentions légales, mise à jour de
  la documentation. À charger avant toute tâche dans ce dépôt.
---

# Projet Ludothèque — procédure

## Avant de coder

1. Lire `AGENTS.md` puis `docs/README.md`.
2. Lire les documents concernés : `product.md`, `architecture.md`, `conventions.md`, et le
   document thématique (`design.md`, `data-google-sheet.md`, `security.md`, `legal.md`, `pwa.md`,
   `quality.md`, `deployment.md`).
3. Vérifier `docs/decisions.md` : ne rien implémenter qui soit encore « proposé » ou listé dans
   les questions ouvertes.
4. Vérifier `docs/roadmap.md` : la tâche correspond-elle à la phase en cours ?

## Pendant

- Toute décision listée dans `AGENTS.md` §3 → **demander** et attendre la réponse.
- Respecter la maquette : aucune couleur, taille ou composant inventé.
- PC et mobile : chaque écran doit fonctionner aux deux.
- Le plus petit changement complet (voir skill `ponytail`).
- Aucun secret dans le dépôt, aucune clé Google côté client.
- Toute écriture passe par Turnstile, vérifié côté serveur.

## Après

1. `npm run format && npm run lint && npm run typecheck && npm run test && npm run build`.
2. Recette mobile + desktop (ou signaler qu'elle n'a pas été faite).
3. Mettre à jour `README.md`, `docs/` et `docs/decisions.md` si une règle change.
4. Terminer la réponse par : ce qui est fait, ce qui n'est pas testé, les risques.

## Interdits

- Ajouter une dépendance ou un service sans validation.
- Écrire dans Google Sheets depuis le navigateur avec une clé.
- Modifier `dist/`, `sw.js`, `manifest.webmanifest`.
- Créer un écran non validé ou un style « provisoire ».
