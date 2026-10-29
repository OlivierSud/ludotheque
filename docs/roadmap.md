# Roadmap

Séquence de travail. Pas de dates : chaque phase démarre quand la précédente est validée.

## Principes

1. Rien n'est implémenté sans maquette ni décision validée.
2. Chaque phase se termine par une démonstration sur mobile **et** desktop.
3. Le README et `docs/` sont à jour à la fin de chaque phase.
4. Une phase peut être réordonnée, jamais contournée sur les points bloquants.

## Vue d'ensemble

| Phase | Nom                             | Statut      | Bloquant pour |
| ----- | ------------------------------- | ----------- | ------------- |
| 0     | Socle technique                 | ✅ Terminé  | —             |
| 1     | Cadrage produit & design        | ⏳ En cours | Tout le reste |
| 2     | Backend Sheets + Turnstile      | ⬜ À faire  | Phase 4       |
| 3     | Frontend lecture                | ⬜ À faire  | Phase 4       |
| 4     | Ajout d'un jeu                  | ⬜ À faire  | Phase 5       |
| 5     | Réglages, PWA, mentions légales | ⬜ À faire  | Phase 6       |
| 6     | Qualité, accessibilité, recette | ⬜ À faire  | Phase 7       |
| 7     | Mise en production              | ⬜ À faire  | —             |
| 8     | Itérations post-v1              | ⬜ À faire  | —             |

> Les phases 2 et 3 peuvent avancer en parallèle : la phase 3 démarre avec des données simulées.

---

## Phase 0 — Socle technique ✅

**Objectif** : dépôt prêt à recevoir l'application.

- [x] Vite + React + TypeScript strict
- [x] ESLint, Prettier, Vitest
- [x] CI (lint, types, tests, build) + déploiement GitHub Pages
- [x] PWA configurée (manifest, service worker, icônes provisoires)
- [x] `start-local.cmd`
- [x] Documentation et règles pour agents IA

**Sortie** : `npm run build` vert, CI verte, page vide servie sur GitHub Pages.

---

## Phase 1 — Cadrage produit & design ⏳

**Objectif** : lever toutes les ambiguïtés avant d'écrire l'interface.

- [ ] Recevoir les wireframes (mobile + desktop)
- [ ] Recevoir la maquette (Figma ou équivalent) et les références de style
- [ ] Extraire la palette, la typographie et les espacements (design tokens)
- [ ] Confirmer les paliers responsive et la navigation (menu Réglages)
- [ ] Valider la liste des filtres et des catégories
- [x] Trancher Q1–Q4 (D-009 à D-012)
- [ ] Trancher Q6, Q10 (`decisions.md`)
- [ ] Mettre à jour `design.md` et `product.md`

**Sortie** : maquette validée, jetons listés, décisions consignées.

**Questions bloquantes** : Q6, Q10.

---

## Phase 2 — Backend Sheets + Turnstile

**Objectif** : une API fiable, gratuite et protégée.

- [ ] Créer la feuille `Jeux` (schéma de `data-google-sheet.md`)
- [ ] Écrire `backend/apps-script/` (Code, validation, Turnstile, Sheets)
- [ ] Configurer Turnstile (site + secret) et les domaines
- [ ] Déployer le Web App et renseigner `VITE_API_URL`
- [ ] Vérifier CORS depuis le navigateur (POST `text/plain`)
- [ ] Tester : liste vide, ajout valide, jeton invalide, payload invalide, rate limit
- [ ] Documenter le déploiement effectivement réalisé

**Sortie** : `GET ?action=list` et un `POST` valide fonctionnent depuis `localhost` et depuis
GitHub Pages.

**Questions bloquantes** : Q8 (si CORS échoue).

---

## Phase 3 — Frontend lecture

**Objectif** : consulter, chercher et filtrer — sans dépendre du backend.

- [ ] `src/main.tsx` + montage React
- [ ] Design tokens et styles globaux issus de la maquette
- [ ] Écran liste (chargement, vide, erreur)
- [ ] Recherche + filtres
- [ ] Fiche d'un jeu
- [ ] Navigation mobile/desktop conforme
- [ ] Données simulées puis branchement sur `services/gamesApi.ts`
- [ ] Tests de la logique de filtrage et des états

**Sortie** : parcours lecture complet, responsive, accessible au clavier.

**Dépend de** : Phase 1 (maquette). Peut démarrer avant la phase 2.

---

## Phase 4 — Ajout d'un jeu

**Objectif** : écrire dans la feuille en toute sécurité.

- [ ] Formulaire conforme à la maquette (mobile + desktop)
- [ ] Validation client (messages, champs obligatoires)
- [ ] Intégration Turnstile (widget + gestion d'erreur)
- [ ] Honeypot + délai minimal
- [ ] Appel `POST`, gestion des erreurs (`captcha`, `validation`, `rate_limited`)
- [ ] Confirmation visuelle et rafraîchissement de la liste
- [ ] Tests du service et du formulaire

**Sortie** : ajout réel vérifié dans la feuille, refus correct des cas invalides.

**Dépend de** : Phases 2 et 3.

---

## Phase 5 — Réglages, PWA, mentions légales

**Objectif** : conformité et confort.

- [ ] Écran Réglages (conforme maquette)
- [ ] Entrée « Installer l'application » (Android/Chrome + instructions iOS)
- [ ] Masquage si déjà installée
- [ ] Mentions légales + politique de confidentialité
- [ ] Version de l'application affichée
- [ ] Vérification hors-ligne (lecture)
- [ ] Comportement de mise à jour validé (Q9)

**Sortie** : installation testée sur un appareil réel, pages légales accessibles.

**Questions bloquantes** : Q7, Q9.

---

## Phase 6 — Qualité, accessibilité, recette

**Objectif** : livrer sereinement.

- [ ] Plan de recette complet (`quality.md`) exécuté
- [ ] Audit accessibilité (contrastes, clavier, lecteur d'écran)
- [ ] Audit performance (Lighthouse mobile ≥ 90)
- [ ] Vérification des quotas et des coûts (0 €)
- [ ] Tests des cas limites (feuille vide, quota, réseau lent)
- [ ] Nettoyage : code mort, `console.log`, TODO

**Sortie** : recette verte, aucune anomalie bloquante.

---

## Phase 7 — Mise en production

- [ ] Variables GitHub renseignées
- [ ] Déploiement Apps Script final
- [ ] Turnstile : domaines de production
- [ ] Mentions légales à jour
- [ ] Test de fumée sur l'URL publique
- [ ] Sauvegarde de la feuille
- [ ] README à jour (URL, état, procédures)

**Sortie** : application publique fonctionnelle, ajout réel possible.

---

## Phase 8 — Itérations post-v1 (à valider)

Idées à ne pas implémenter sans validation :

- Tri (titre, durée, joueurs, âge)
- Favoris locaux
- Partage d'une fiche (URL)
- Mode clair / sombre
- Export CSV de la collection
- Modération assistée

Chaque idée passe par le protocole « demander avant » et une entrée dans `decisions.md`.
