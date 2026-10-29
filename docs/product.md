# Produit

## Vision

Une ludothèque en ligne, joyeuse et immédiate : consulter sa collection de jeux de société,
rechercher un jeu, en ajouter un — **sans compte, sans friction**, sur mobile comme sur PC.

## Cibles

| Persona                | Besoin principal                                                   |
| ---------------------- | ------------------------------------------------------------------ |
| Joueur occasionnel     | Voir rapidement ce qui est disponible et à combien on peut jouer   |
| Organisateur de soirée | Filtrer par nombre de joueurs, durée et âge, puis choisir          |
| Prêteur / association  | Ajouter un jeu à la collection depuis son téléphone, en une minute |

## Périmètre (v1)

### Inclus

- Consulter la liste des jeux (lecture publique).
- Rechercher et filtrer (texte, catégorie, nombre de joueurs, durée, âge).
- Consulter la fiche d'un jeu.
- Ajouter un jeu via un formulaire (écriture publique, protégée par Turnstile).
- Menu **Réglages** : installation PWA, mentions légales, confidentialité, version.
- Fonctionnement hors ligne en lecture (PWA installée).

### Exclu (v1)

- Comptes utilisateurs, profils, rôles.
- Modification / suppression par les visiteurs.
- Notes, avis, commentaires, photos uploadées.
- Notifications push, synchronisation multi-appareils.
- Paiement, réservation, prêt avec échéance.

Toute demande hors périmètre suit le protocole « demander avant » (`AGENTS.md` §3).

## Exigences fonctionnelles

| ID    | Exigence                                                              | Priorité |
| ----- | --------------------------------------------------------------------- | -------- |
| FR-1  | Afficher la liste des jeux avec un état de chargement et un état vide | Must     |
| FR-2  | Rechercher par titre, description et tags (insensible casse/accents)  | Must     |
| FR-3  | Filtrer par catégorie, nombre de joueurs, durée et âge                | Must     |
| FR-4  | Afficher la fiche détaillée d'un jeu                                  | Must     |
| FR-5  | Ajouter un jeu via un formulaire validé                               | Must     |
| FR-6  | Protéger l'ajout par Cloudflare Turnstile                             | Must     |
| FR-7  | Proposer l'installation PWA dans le menu Réglages                     | Must     |
| FR-8  | Afficher les mentions légales et la politique de confidentialité      | Must     |
| FR-9  | Rester utilisable hors ligne (lecture du dernier état chargé)         | Should   |
| FR-10 | Signaler les erreurs réseau et permettre de réessayer                 | Must     |
| FR-11 | Afficher la version de l'application dans les Réglages                | Should   |

## Exigences non fonctionnelles

| ID    | Exigence                                                                     |
| ----- | ---------------------------------------------------------------------------- |
| NFR-1 | Responsive : mobile 360 px → desktop ≥ 1440 px, sans scroll horizontal       |
| NFR-2 | Accessibilité : WCAG 2.1 AA (contrastes, clavier, labels, focus visible)     |
| NFR-3 | Performance : LCP < 2,5 s sur 4G, bundle initial < 250 kB gzip               |
| NFR-4 | Coût : 0 € — GitHub Pages + Google Sheets/Apps Script + Cloudflare Turnstile |
| NFR-5 | Sécurité : aucune clé secrète côté client, validation serveur systématique   |
| NFR-6 | Vie privée : pas de compte, pas de cookie de suivi, collecte minimale        |
| NFR-7 | Résilience : quota Google dépassé → message clair, pas d'écran blanc         |

## Parcours utilisateur

1. **Découvrir** — arrivée sur la liste, chargement, affichage des jeux.
2. **Chercher** — saisie dans la recherche, filtres, résultat immédiat ou état vide explicite.
3. **Consulter** — ouverture d'une fiche, retour à la liste en conservant les filtres.
4. **Ajouter** — formulaire, Turnstile résolu, validation, succès, le jeu apparaît dans la liste.
5. **Installer** — Réglages → « Installer l'application » → instructions selon la plateforme.
6. **Se protéger** — Réglages → mentions légales / confidentialité.

## Règles métier

- Un jeu possède : titre, catégorie, joueurs min/max, âge min, durée, description, tags.
- `joueurs_min ≤ joueurs_max`, bornes 1–20.
- Catégories fermées (liste validée côté serveur).
- Un ajout refusé par Turnstile ou invalide n'écrit **rien** dans la feuille.
- Les données affichées proviennent de la feuille ; le client ne fait pas de calcul de vérité.
- Aucun champ libre n'est interprété comme du HTML.

## Critères d'acceptation (extraits)

```gherkin
Scénario: ajouter un jeu valide
  Étant donné un formulaire rempli avec des valeurs valides
  Et un jeton Turnstile résolu
  Quand j'envoie le formulaire
  Alors une ligne est ajoutée dans la feuille "Jeux"
  Et le jeu apparaît dans la liste sans rechargement manuel

Scénario: jeton Turnstile absent
  Étant donné un formulaire valide sans jeton
  Quand j'envoie le formulaire
  Alors l'API répond { ok: false, error: "captcha" }
  Et aucune ligne n'est ajoutée

Scénario: installation PWA sur mobile
  Étant donné l'application ouverte dans un navigateur mobile
  Quand j'ouvre Réglages
  Alors une entrée "Installer l'application" est visible
  Et elle est masquée si l'application est déjà installée
```

## Questions ouvertes

Voir [`decisions.md`](./decisions.md#questions-ouvertes). Tant qu'une question impacte une
exigence, l'exigence est marquée **à valider**.
