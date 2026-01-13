import { Rating } from '@/types';

/**
 * Formater la distance en km ou m
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Formater la date au format français
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return date.toLocaleDateString('fr-FR', options);
}

/**
 * Formater l'heure au format HH:MM
 */
export function formatTime(timeString: string): string {
  // Si déjà au format HH:MM, retourner tel quel
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    return timeString;
  }
  
  // Sinon, parser et formater
  const date = new Date(timeString);
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

/**
 * Générer un ID unique
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculer la note moyenne à partir d'un tableau de notations
 */
export function calculateAverageRating(ratings: Rating[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.score, 0);
  return Math.round((sum / ratings.length) * 10) / 10; // Arrondi à 1 décimale
}

/**
 * Obtenir le badge de couleur selon le statut du rendez-vous
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return '#F59E0B'; // Orange
    case 'confirmed':
      return '#2563EB'; // Bleu
    case 'completed':
      return '#10B981'; // Vert
    case 'cancelled':
      return '#EF4444'; // Rouge
    default:
      return '#6B7280'; // Gris
  }
}

/**
 * Obtenir le libellé français du statut
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'confirmed':
      return 'Confirmé';
    case 'completed':
      return 'Terminé';
    case 'cancelled':
      return 'Annulé';
    default:
      return status;
  }
}

/**
 * Vérifier si une date est passée
 */
export function isPastDate(dateString: string, timeString: string): boolean {
  const appointmentDate = new Date(`${dateString}T${timeString}`);
  return appointmentDate < new Date();
}

/**
 * Formater le nom complet
 */
export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}