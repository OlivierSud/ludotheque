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

## Maquette reçue — principe de placement (2026-10-29)

Source : `gemini-code-1793275109642.html` (fichier fourni par l'utilisateur). Le style est
provisoire et pourra évoluer ; la **structure et le placement** font foi.

### Palette extraite

| Clé      | Hex     | Usage dans la maquette           |
| -------- | ------- | -------------------------------- |
| `olive`  | #4B6A4A | barre latérale d'un jeu          |
| `blue`   | #005B9F | onglet « Liste des jeux »        |
| `teal`   | #00959F | actif « Tag B », barres, boutons |
| `purple` | #8B73A3 | (accent)                         |
| `pink`   | #F26D7D | barre « Jeu de Français »        |
| `yellow` | #FFC222 | onglet « Filtres »               |
| `orange` | #E25822 | actif « Niveau 1 »               |
| surface  | #F8F8F8 | fond de la carte                 |
| fond     | #D1D3D4 | fond de page                     |
| texte    | #2B2B2B | texte principal                  |

Typographie : Helvetica Neue (système) ; pas de webfont payante.

### Disposition desktop (carte centrée, max 1024 px, hauteur 85 vh)

- En-tête permanent : titre « La Ludothèque » + sous-titre « Le répertoire des jeux pédagogiques » + bouton réglages, toujours visible au sommet de la carte (décision D-021).
- Section **Filtres** : affichage compact limité au premier quart de l'écran (`max-height: 25%`, décision D-022) avec lignes épurées par critère, pastilles réduites et bouton de réinitialisation rapide pour maximiser la hauteur consacrée aux résultats de jeux.
- Section **Résultats** : affichage en empilement de livres (`.book-stack`, décision D-020) avec bordure gauche colorée, losange `◆`, bouton `i`, et légère rotation/décalage aléatoires déterministes.
- Système de volets coulissants (décision D-021) : rail coulissant en dessous du titre. En vue Filtres, la double colonne d'onglets (jaune « Filtres » et bleu « Liste des jeux ») est calée à droite ; en vue Liste des jeux, elle est calée à gauche. L'onglet actif est fortement accentué.
  - Sous-vue **Base de données** : même style unifié en pile de livres que les résultats (décision D-020).
  - Sous-vue **Édition du jeu** : retour, nom (lecture seule dans la maquette), lien, critères
    avec crayon, modale de sélection, bouton « + » pour ajouter une option.
- Modale : options en radio/checkbox, bouton « + » circulaire.
- Toast bas : « Ouverture de : … » + « Annuler ».

### Mobile (décision D-016)

Barre d'onglets basse « Jeux / Filtres / Liste ». Les onglets verticaux sont masqués.

### Écarts validés

- Bouton « Enregistrer » dans l'en-tête du formulaire et « Nouveau jeu » dans la liste
  (D-017), absents de la maquette.
- Les critères et options sont dynamiques (D-014) : la maquette en montre 3 à titre d'exemple.

### À confirmer avec l'utilisateur

- Style final (palette, typo) : la maquette est provisoire.
- Références de style (sites, applications) : toujours demandées.
- États vide, chargement, erreur : non représentés, à concevoir dans l'esprit de la maquette.

## Livrables attendus dans le dépôt

- `docs/design/` : captures de référence, extraits de maquette (si autorisé).
- `src/styles/tokens.css` (ou équivalent) : jetons issus de la maquette.
- Un composant = un fichier, nommé d'après le vocabulaire de la maquette.

## À ne pas faire

- Choisir une palette « en attendant ».
- Ajouter une animation non prévue.
- Utiliser une librairie UI qui impose son style (Material, Bootstrap…) sans validation.
- Adapter la maquette à la technique : c'est la technique qui s'adapte.
