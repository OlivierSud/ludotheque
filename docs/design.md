# Design & maquette

## Règle absolue

**La maquette fournie est la source de vérité visuelle.** Aucune couleur, taille, typographie,
espacement ou composant ne doit être inventé. En cas d'ambiguïté : demander, ne pas deviner.

## Style cible

- Ton **joyeux**, chaleureux, ludique.
- **Couleurs vives** en accents, sur une base lisible.
- Formes arrondies, ombres douces, micro-animations discrètes.
- Aucun effet au détriment de la lisibilité ou de la performance.

> ⚠️ **Références de style à demander avant toute implémentation visuelle.**
> Demander à l'utilisateur : 2–4 références (sites, applications, captures, Dribbble/Pinterest),
> la palette souhaitée, la typographie et l'ambiance générale. Ne pas commencer le styling sans
> ces éléments.

## Écrans à recevoir (wireframes)

1. Liste / accueil (recherche + filtres)
2. Fiche d'un jeu
3. Formulaire d'ajout
4. Réglages (dont installation PWA, mentions légales, version)
5. Mentions légales / confidentialité
6. États : chargement, vide, erreur, succès

Pour chaque écran, récupérer : version mobile, version desktop, états interactifs, et les
espacements/marges si disponibles.

## Responsive

| Palier   | Largeur       | Cible                       |
| -------- | ------------- | --------------------------- |
| Mobile   | 360 – 767 px  | 1 colonne, navigation basse |
| Tablette | 768 – 1023 px | 2 colonnes                  |
| Desktop  | ≥ 1024 px     | 3–4 colonnes, marges larges |

> Ces paliers sont une hypothèse : **à confirmer avec la maquette**.

Règles :

- Mobile-first, media queries en `min-width`.
- Zones tactiles ≥ 44 × 44 px.
- Pas de scroll horizontal, jamais.
- Le menu Réglages est accessible sur les deux formats (icône ou entrée dédiée).

## Jetons de design (design tokens)

À extraire de la maquette dans un fichier unique (CSS variables) :

```css
:root {
  --color-primary: …; /* couleur vive principale */
  --color-secondary: …;
  --color-accent: …;
  --color-surface: …;
  --color-text: …;
  --color-text-muted: …;
  --radius-sm: …;
  --radius-md: …;
  --radius-lg: …;
  --space-1: …;
  --font-body: …;
  --font-heading: …;
}
```

Aucune valeur codée en dur dans un composant. Les noms sont **à valider** avec la maquette.

## Accessibilité visuelle

Les couleurs vives imposent des précautions :

- Contraste texte/fond ≥ 4,5:1 (≥ 3:1 pour les grands textes) — vérifier chaque paire.
- Ne jamais transmettre une information **uniquement** par la couleur (ajouter icône, texte, forme).
- Focus visible sur tous les éléments interactifs.
- Tester en niveaux de gris et en mode sombre si la maquette le prévoit.
- Respecter `prefers-reduced-motion`.

## Process de validation visuelle

1. Recevoir wireframes + maquette + références.
2. Lister les écrans et les états manquants ; poser les questions.
3. Extraire les jetons, créer la structure sans style.
4. Implémenter écran par écran, mobile d'abord.
5. Comparer côte à côte (capture vs maquette) aux largeurs 375 / 768 / 1440.
6. Corriger les écarts ; documenter tout écart validé.
7. Faire valider avant de passer à l'écran suivant.

## Écarts et décisions

Tout écart (composant indisponible, contraste insuffisant, contrainte technique) est :

1. expliqué avec une capture ou un extrait,
2. proposé sous forme d'options,
3. validé par l'utilisateur,
4. consigné dans [`decisions.md`](./decisions.md).

## Livrables attendus dans le dépôt

- `docs/design/` : captures de référence, extraits de maquette (si autorisé).
- `src/styles/tokens.css` (ou équivalent) : jetons issus de la maquette.
- Un composant = un fichier, nommé d'après le vocabulaire de la maquette.

## À ne pas faire

- Choisir une palette « en attendant ».
- Ajouter une animation non prévue.
- Utiliser une librairie UI qui impose son style (Material, Bootstrap…) sans validation.
- Adapter la maquette à la technique : c'est la technique qui s'adapte.
