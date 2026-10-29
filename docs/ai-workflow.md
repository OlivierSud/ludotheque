# Workflow des agents IA

## Objectif

Rendre chaque intervention prévisible : mêmes règles, mêmes vérifications, mêmes documents mis à
jour. Les outils ci-dessous sont **de développement uniquement** : ils n'ajoutent aucune dépendance
à l'application livrée.

## Prérequis à installer (une fois par poste)

| Outil        | Rôle                                               | Statut                                                   |
| ------------ | -------------------------------------------------- | -------------------------------------------------------- |
| **Ponytail** | Règles « moindre code » injectées à chaque tour    | Skill installé (`.opencode/skills/ponytail/`)            |
| **Graphify** | Graphe de connaissances du code, interrogé via MCP | Installé (graphifyy 0.9.97), graphe dans `graphify-out/` |
| **Skills**   | Procédures projet chargées à la demande            | `.opencode/skills/` + skill global `graphify`            |

### Ponytail

Installé comme skill projet : `.opencode/skills/ponytail/SKILL.md` (MIT, source
`DietrichGebert/ponytail`). Il s'active automatiquement pour toute tâche de code.

- Niveaux : `lite`, `full` (défaut), `ultra`.
- Échelle : (1) est-ce nécessaire ? (2) déjà dans le code ? (3) stdlib/natif ? (4) dépendance
  installée ? (5) une ligne ? (6) le minimum qui marche.
- **Ne jamais couper** : validation aux frontières, gestion d'erreur, sécurité, accessibilité.
- Un raccourci assumé se commente : `shortcut: <limite>, <quand améliorer>`.

Conflit possible avec les règles projet : **les règles projet gagnent** (maquette, gratuité,
sécurité).

### Graphify

Graphe local du dépôt (AST, sans LLM), interrogeable en CLI ou via MCP. **Déjà installé** sur ce
poste :

- paquet `graphifyy` (pip) ;
- skill global `~/.config/opencode/skills/graphify/` ;
- plugin projet `.opencode/plugins/graphify.js` (rappel automatique du graphe) ;
- serveur MCP déclaré dans `opencode.json` ;
- graphe construit : `graphify-out/graph.json`.

Le binaire `graphify` n'est pas toujours dans le `PATH` sous Windows : utiliser `python -m graphify`.

```bash
# Construction / mise à jour du graphe (sans LLM)
python -m graphify update .

# Interrogation
python -m graphify query "où est validée l'écriture d'un jeu ?"
python -m graphify path "AddGameForm" "gamesApi"
python -m graphify explain "gamesApi"
```

Installation sur un nouveau poste (Python ≥ 3.10) :

```bash
pip install graphifyy
python -m graphify install --platform opencode   # skill + plugin
python -m graphify update .
```

Règles d'usage :

1. Avant une recherche large (`grep` sur tout le dépôt), interroger le graphe.
2. Reconstruire le graphe après un changement structurel (nouveau dossier, gros refactor).
3. Le graphe ne remplace pas la lecture du code touché : il sert à **trouver** et **cartographier**.
4. `graphify-out/` est généré et ignoré par Git ; il se régénère avec la commande ci-dessus.
5. Ne pas activer l'extraction sémantique LLM (coût) : l'extraction AST suffit au projet.

> Graphify n'est **pas** nécessaire au fonctionnement de l'application. S'il est absent, le
> signaler et continuer avec les outils natifs.

### Agent skills

Les skills vivent dans `.opencode/skills/<nom>/SKILL.md` et sont chargées à la demande.

| Skill        | Quand l'utiliser                                     |
| ------------ | ---------------------------------------------------- |
| `ponytail`   | Toute tâche de code                                  |
| `ludotheque` | Toute tâche dans ce dépôt (règles projet, ask-first) |

Créer un nouveau skill seulement s'il décrit une procédure réutilisable et stable (ex.
`sheet-backend`, `design-review`). Un skill = un objectif, des étapes, des critères de sortie.

## Boucle de travail (à chaque requête)

1. **Lire** — `AGENTS.md`, puis les documents concernés (ordre de lecture §1).
2. **Cartographier** — Graphify si disponible, sinon lecture ciblée du code.
3. **Questionner** — toute décision listée dans `AGENTS.md` §3 → demander et attendre.
4. **Planifier** — annoncer les fichiers touchés et les vérifications prévues.
5. **Implémenter** — le plus petit changement complet (Ponytail), conforme à la maquette.
6. **Vérifier** — format, lint, typecheck, tests, build + recette manuelle ciblée.
7. **Documenter** — README/docs/décisions dans le même commit.
8. **Rendre compte** — ce qui est fait, ce qui n'est pas testé, les risques.

## Règles de coût et de gratuité

- Aucune API payante, aucun essai limité, aucun service qui devient payant à l'échelle visée.
- Préférer : GitHub Pages, Apps Script, Sheets, Turnstile, bibliothèques open source.
- Avant d'ajouter un service : vérifier quota gratuit, conditions, et **demander**.
- Pas de génération d'images ou de sons par IA dans l'app (coût + droits).

## Ce qu'un agent ne fait jamais

- Choisir une techno, un routeur, une lib UI ou un schéma de données sans validation.
- Ajouter une dépendance pour économiser quelques lignes.
- Inventer un écran, une couleur ou un wording absent de la maquette.
- Modifier `dist/`, `sw.js`, `manifest.webmanifest`.
- Committer un secret ou un `.env`.
- Terminer une tâche sans mettre à jour la documentation concernée.

## Checklist de fin de tâche

- [ ] Décisions demandées et validées (ou explicitement listées comme en attente)
- [ ] `npm run format && npm run lint && npm run typecheck && npm run test && npm run build`
- [ ] Recette mobile + desktop effectuée (ou signalée comme non faite)
- [ ] README / docs / `decisions.md` à jour
- [ ] Aucun secret, aucun `console.log`, aucun code mort
- [ ] Risques et limites signalés en fin de réponse
