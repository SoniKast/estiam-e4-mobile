import { Appointment, User } from '@/types';

/**
 * Données de test pour les utilisateurs
 */
export const MOCK_USERS: User[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    userType: 'provider',
    location: {
      latitude: 0,
      longitude: 0,
      city: 'Position en attente...',
      address: 'Localisation en cours',
      lastUpdated: new Date().toISOString(),
    },
    rating: 4.5,
    totalAppointments: 27,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    firstName: 'Paul',
    lastName: 'Martin',
    email: 'paul.martin@example.com',
    phone: '+33 6 23 45 67 89',
    userType: 'provider',
    location: {
      latitude: 48.8606,
      longitude: 2.3376,
      city: 'Paris',
      address: '42 Avenue des Champs-Élysées',
      lastUpdated: new Date().toISOString(),
    },
    rating: 4.0,
    totalAppointments: 12,
    createdAt: '2025-02-15T00:00:00Z',
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Leroy',
    email: 'sophie.leroy@example.com',
    phone: '+33 6 34 56 78 90',
    userType: 'provider',
    location: {
      latitude: 48.8738,
      longitude: 2.2950,
      city: 'Paris',
      address: '8 Place Charles de Gaulle',
      lastUpdated: new Date().toISOString(),
    },
    rating: 5.0,
    totalAppointments: 41,
    createdAt: '2024-11-20T00:00:00Z',
  },
  {
    id: '4',
    firstName: 'Bruno',
    lastName: 'Lefevre',
    email: 'bruno.lefevre@example.com',
    phone: '+33 6 45 67 89 01',
    userType: 'provider',
    location: {
      latitude: 48.8529,
      longitude: 2.3499,
      city: 'Paris',
      address: '12 Rue de la Bastille',
      lastUpdated: new Date().toISOString(),
    },
    rating: 4.8,
    totalAppointments: 44,
    createdAt: '2024-10-05T00:00:00Z',
  },
  {
    id: '5',
    firstName: 'Caroline',
    lastName: 'Dubois',
    email: 'caroline.dubois@example.com',
    phone: '+33 6 56 78 90 12',
    userType: 'provider',
    location: {
      latitude: 48.8584,
      longitude: 2.2945,
      city: 'Paris',
      address: '5 Avenue de la Tour Eiffel',
      lastUpdated: new Date().toISOString(),
    },
    rating: 4.7,
    totalAppointments: 22,
    createdAt: '2025-03-10T00:00:00Z',
  },
  {
    id: '6',
    firstName: 'Thomas',
    lastName: 'Bernard',
    email: 'thomas.bernard@example.com',
    phone: '+33 6 67 89 01 23',
    userType: 'renter',
    location: {
      latitude: 48.8534,
      longitude: 2.3488,
      city: 'Paris',
      address: '20 Rue Saint-Antoine',
      lastUpdated: new Date().toISOString(),
    },
    rating: 4.3,
    totalAppointments: 15,
    createdAt: '2025-01-20T00:00:00Z',
  },
  {
    id: '7',
    firstName: 'Julie',
    lastName: 'Petit',
    email: 'julie.petit@example.com',
    phone: '+33 6 78 90 12 34',
    userType: 'renter',
    location: {
      latitude: 48.8606,
      longitude: 2.3376,
      city: 'Paris',
      address: '30 Boulevard Haussmann',
      lastUpdated: new Date().toISOString(),
    },
    rating: 4.6,
    totalAppointments: 8,
    createdAt: '2025-02-28T00:00:00Z',
  },
  {
    id: '8',
    firstName: 'Lucas',
    lastName: 'Roux',
    email: 'lucas.roux@example.com',
    phone: '+33 6 89 01 23 45',
    userType: 'renter',
    location: {
      latitude: 48.8499,
      longitude: 2.3465,
      city: 'Paris',
      address: '18 Rue de Turenne',
      lastUpdated: new Date().toISOString(),
    },
    rating: 4.9,
    totalAppointments: 19,
    createdAt: '2024-12-15T00:00:00Z',
  },
];

/**
 * Données de test pour les rendez-vous
 */
export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    renterId: '6',
    providerId: '1',
    date: '2026-01-15',
    time: '14:00',
    status: 'confirmed',
    service: 'Consultation',
    notes: 'Première consultation',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'apt-2',
    renterId: '7',
    providerId: '2',
    date: '2026-01-14',
    time: '10:30',
    status: 'pending',
    service: 'Rendez-vous',
    createdAt: '2026-01-12T15:30:00Z',
  },
  {
    id: 'apt-3',
    renterId: '8',
    providerId: '3',
    date: '2026-01-10',
    time: '16:00',
    status: 'completed',
    service: 'Service express',
    createdAt: '2026-01-05T09:00:00Z',
    renterRating: {
      score: 5,
      comment: 'Excellent service, très professionnel !',
      createdAt: '2026-01-10T17:00:00Z',
      createdBy: '8',
    },
    providerRating: {
      score: 5,
      comment: 'Client ponctuel et agréable',
      createdAt: '2026-01-10T17:05:00Z',
      createdBy: '3',
    },
  },
  {
    id: 'apt-4',
    renterId: '6',
    providerId: '4',
    date: '2026-01-20',
    time: '11:00',
    status: 'confirmed',
    service: 'Rendez-vous de suivi',
    notes: 'Deuxième rendez-vous',
    createdAt: '2026-01-11T14:00:00Z',
  },
  {
    id: 'apt-5',
    renterId: '7',
    providerId: '5',
    date: '2026-01-08',
    time: '09:00',
    status: 'completed',
    service: 'Consultation initiale',
    createdAt: '2026-01-03T11:00:00Z',
    renterRating: {
      score: 4,
      comment: 'Très bien, à recommander',
      createdAt: '2026-01-08T10:00:00Z',
      createdBy: '7',
    },
    providerRating: {
      score: 5,
      comment: 'Parfait',
      createdAt: '2026-01-08T10:05:00Z',
      createdBy: '5',
    },
  },
];

/**
 * Initialiser les données de test dans le stockage
 */
export async function initializeMockData() {
  const { StorageService } = await import('@/services/storage.service');
  
  // Vérifier si des données existent déjà
  const hasData = await StorageService.hasData();
  
  if (!hasData) {
    // Sauvegarder les utilisateurs
    await StorageService.saveUsers(MOCK_USERS);
    
    // Sauvegarder les rendez-vous
    await StorageService.saveAppointments(MOCK_APPOINTMENTS);
    
    console.log('Mock data initialized successfully');
  } else {
    console.log('Data already exists, skipping mock data initialization');
  }
}