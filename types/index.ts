// Type d'utilisateur
export type UserType = 'renter' | 'provider';

// Statut de rendez-vous
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// Interface Localisation
export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  address?: string;
  lastUpdated: string;
}

// Interface Utilisateur
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userType: UserType;
  location: Location;
  rating: number;
  totalAppointments: number;
  createdAt: string;
  profileImage?: string;
}

// Interface pour utilisateur avec distance
export interface UserWithDistance extends User {
  distance: number; // en km
}

// Interface Notation
export interface Rating {
  score: number; // 1-5
  comment?: string;
  createdAt: string;
  createdBy: string;
}

// Interface Rendez-vous
export interface Appointment {
  id: string;
  renterId: string;
  providerId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  service?: string;
  notes?: string;
  createdAt: string;
  renterRating?: Rating;
  providerRating?: Rating;
}

// Interface pour les statistiques utilisateur
export interface UserStats {
  totalAppointments: number;
  completedAppointments: number;
  averageRating: number;
  totalRatings: number;
}