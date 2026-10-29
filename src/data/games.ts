import type { Game } from '@/types';

/**
 * Collection de démonstration.
 * À remplacer par une source de données réelle (API, fichier JSON, stockage local).
 */
export const games: readonly Game[] = [
  {
    id: 'catan',
    title: 'Les Colons de Catane',
    minPlayers: 3,
    maxPlayers: 4,
    minAge: 10,
    durationMinutes: 90,
    category: 'Stratégie',
    description:
      'Colonisez une île en échangeant des ressources et en construisant routes, villages et villes.',
    tags: ['gestion', 'négociation', 'classique'],
  },
  {
    id: 'codenames',
    title: 'Codenames',
    minPlayers: 4,
    maxPlayers: 8,
    minAge: 12,
    durationMinutes: 20,
    category: 'Ambiance',
    description:
      'Deux équipes s’affrontent en devinant des mots à partir d’indices donnés par leur agent secret.',
    tags: ['déduction', 'équipes', 'apéro'],
  },
  {
    id: 'pandemic',
    title: 'Pandemic',
    minPlayers: 2,
    maxPlayers: 4,
    minAge: 10,
    durationMinutes: 45,
    category: 'Coopératif',
    description:
      'Unissez vos forces pour enrayer quatre épidémies avant que la situation ne devienne incontrôlable.',
    tags: ['coopération', 'gestion', 'tension'],
  },
  {
    id: 'dixit',
    title: 'Dixit',
    minPlayers: 3,
    maxPlayers: 6,
    minAge: 8,
    durationMinutes: 30,
    category: 'Famille',
    description:
      'Laissez parler votre imagination : racontez une carte illustrée sans la dévoiler aux autres joueurs.',
    tags: ['imagination', 'cartes', 'poétique'],
  },
  {
    id: 'jungle-speed',
    title: 'Jungle Speed',
    minPlayers: 2,
    maxPlayers: 8,
    minAge: 7,
    durationMinutes: 15,
    category: 'Ambiance',
    description:
      'Reflexes et observation : attrapez le totem dès que deux symboles identiques apparaissent.',
    tags: ['rapidité', 'reflexes', 'rigolade'],
  },
  {
    id: '7-wonders',
    title: '7 Wonders',
    minPlayers: 2,
    maxPlayers: 7,
    minAge: 10,
    durationMinutes: 45,
    category: 'Stratégie',
    description: 'Développez votre cité antique en draftant des cartes sur trois âges successifs.',
    tags: ['draft', 'civilisation', 'cartes'],
  },
  {
    id: 'the-crew',
    title: 'The Crew',
    minPlayers: 2,
    maxPlayers: 5,
    minAge: 10,
    durationMinutes: 25,
    category: 'Coopératif',
    description:
      'Une campagne spatiale de plis coopératifs : remplissez les missions sans communiquer librement.',
    tags: ['plis', 'campagne', 'communication'],
  },
  {
    id: 'dobble',
    title: 'Dobble',
    minPlayers: 2,
    maxPlayers: 8,
    minAge: 6,
    durationMinutes: 15,
    category: 'Enfants',
    description: 'Trouvez le symbole commun entre deux cartes plus vite que vos adversaires.',
    tags: ['observation', 'rapidité', 'accessible'],
  },
  {
    id: 'azul',
    title: 'Azul',
    minPlayers: 2,
    maxPlayers: 4,
    minAge: 8,
    durationMinutes: 40,
    category: 'Famille',
    description: 'Posez des azulejos sur votre palais portugais en draftant des tuiles colorées.',
    tags: ['placement', 'abstrait', 'esthétique'],
  },
];
