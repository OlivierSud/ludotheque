import { ApiError } from '@/services/api';

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'not_configured':
        return "L'application n'est pas configurée (VITE_API_URL manquant).";
      case 'network':
        return 'Connexion au serveur impossible. Vérifiez votre réseau.';
      case 'captcha':
        return 'La vérification anti-robot a échoué. Réessayez.';
      case 'validation':
        return 'Certains champs sont invalides.';
      case 'rate_limited':
        return 'Trop de requêtes. Réessayez dans une heure.';
      case 'not_found':
        return 'Jeu introuvable.';
      default:
        return 'Une erreur serveur est survenue.';
    }
  }
  return 'Une erreur inattendue est survenue.';
}
