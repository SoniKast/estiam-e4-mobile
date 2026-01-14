import { initializeMockData } from '@/data/mock-data';
import { LocationService } from '@/services/location.service';
import { StorageService } from '@/services/storage.service';
import { Appointment, AppointmentStatus, Location, Rating, User, UserWithDistance } from '@/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AppContextType {
  // État
  currentUser: User | null;
  users: User[];
  appointments: Appointment[];
  isLoading: boolean;

  // Actions utilisateur
  setCurrentUser: (user: User | null) => void;
  updateUserLocation: (location: Location) => Promise<void>;

  // Actions rendez-vous
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;

  // Actions notation
  addRating: (appointmentId: string, rating: Rating, isProvider: boolean) => Promise<void>;

  // Requêtes
  getUsersNearby: (radiusKm?: number) => UserWithDistance[];
  getMyAppointments: () => Appointment[];
  getPendingAppointments: () => Appointment[];
  getUpcomingAppointments: () => Appointment[];
  getCompletedAppointments: () => Appointment[];
  getUserById: (userId: string) => User | undefined;
  getAppointmentById: (appointmentId: string) => Appointment | undefined;

  // Utilitaires
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données au démarrage
  useEffect(() => {
    loadInitialData();
  }, []);

  // Surveiller la position de Marie en temps réel
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startWatchingMarieLocation = async () => {
      if (currentUser && currentUser.id === '1') {
        locationSubscription = await LocationService.watchLocation(
          async (location) => {
            const newLocation = await LocationService.createLocationFromCoords(location);
            await updateUserLocationForUser('1', newLocation);
          }
        );
      }
    };

    startWatchingMarieLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [currentUser]);

  /**
   * Charger les données initiales
   */
  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Initialiser les données de test si nécessaire
      await initializeMockData();

      // Charger l'utilisateur courant
      const user = await StorageService.getCurrentUser();
      setCurrentUserState(user);

      // Charger tous les utilisateurs
      const allUsers = await StorageService.getUsers();
      setUsers(allUsers);

      // Charger tous les rendez-vous
      const allAppointments = await StorageService.getAppointments();
      setAppointments(allAppointments);

      // Si l'utilisateur Marie est connecté, mettre à jour sa localisation avec la position réelle
      if (user && user.id === '1') {
        await updateMarieLocationWithRealPosition();
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Rafraîchir les données
   */
  const refreshData = async () => {
    await loadInitialData();
  };

  /**
   * Définir l'utilisateur courant
   */
  const setCurrentUser = async (user: User | null) => {
    try {
      if (user) {
        await StorageService.saveCurrentUser(user);
      } else {
        await StorageService.clearCurrentUser();
      }
      setCurrentUserState(user);
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  };

  /**
   * Mettre à jour la localisation de l'utilisateur
   */
  const updateUserLocation = async (location: Location) => {
    try {
      if (!currentUser) return;

      const updatedUser = {
        ...currentUser,
        location,
      };

      await StorageService.updateUser(currentUser.id, { location });
      setCurrentUserState(updatedUser);

      // Mettre à jour dans la liste des utilisateurs
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
      );
    } catch (error) {
      console.error('Error updating user location:', error);
    }
  };

  /**
   * Créer un nouveau rendez-vous
   */
  const createAppointment = async (
    appointmentData: Omit<Appointment, 'id' | 'createdAt'>
  ) => {
    try {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: `apt-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      await StorageService.addAppointment(newAppointment);
      setAppointments((prev) => [...prev, newAppointment]);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  /**
   * Mettre à jour le statut d'un rendez-vous
   */
  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await StorageService.updateAppointment(id, { status });
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  };

  /**
   * Ajouter une notation à un rendez-vous
   */
  const addRating = async (
    appointmentId: string,
    rating: Rating,
    isProvider: boolean
  ) => {
    try {
      await StorageService.addRating(appointmentId, rating, isProvider);

      // Rafraîchir les données pour obtenir les notes mises à jour
      await refreshData();
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  };

  /**
   * Obtenir les utilisateurs à proximité
   */
  const getUsersNearby = (radiusKm: number = 10): UserWithDistance[] => {
    if (!currentUser || !currentUser.location) return [];

    // Filtrer les utilisateurs du type opposé
    const targetUserType = currentUser.userType === 'renter' ? 'provider' : 'renter';
    const filteredUsers = users.filter(
      (u) => u.id !== currentUser.id && u.userType === targetUserType
    );

    return LocationService.filterByRadius(
      filteredUsers,
      currentUser.location,
      radiusKm
    );
  };

  /**
   * Obtenir tous les rendez-vous de l'utilisateur courant
   */
  const getMyAppointments = (): Appointment[] => {
    if (!currentUser) return [];

    return appointments.filter(
      (apt) => apt.renterId === currentUser.id || apt.providerId === currentUser.id
    );
  };

  /**
   * Obtenir les rendez-vous en attente
   */
  const getPendingAppointments = (): Appointment[] => {
    return getMyAppointments().filter((apt) => apt.status === 'pending');
  };

  /**
   * Obtenir les rendez-vous à venir (confirmés et futurs)
   */
  const getUpcomingAppointments = (): Appointment[] => {
    const now = new Date();
    return getMyAppointments()
      .filter((apt) => {
        if (apt.status !== 'confirmed') return false;
        const aptDate = new Date(`${apt.date}T${apt.time}`);
        return aptDate > now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
  };

  /**
   * Obtenir les rendez-vous terminés
   */
  const getCompletedAppointments = (): Appointment[] => {
    return getMyAppointments()
      .filter((apt) => apt.status === 'completed')
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime(); // Plus récent en premier
      });
  };

  /**
   * Obtenir un utilisateur par son ID
   */
  const getUserById = (userId: string): User | undefined => {
    return users.find((u) => u.id === userId);
  };

  /**
   * Obtenir un rendez-vous par son ID
   */
  const getAppointmentById = (appointmentId: string): Appointment | undefined => {
    return appointments.find((apt) => apt.id === appointmentId);
  };

  /**
   * Mettre à jour la localisation de Marie avec la position réelle de l'appareil
   */
  const updateMarieLocationWithRealPosition = async () => {
    try {
      const currentLocation = await LocationService.getCurrentLocation();
      if (!currentLocation) return;

      const newLocation = await LocationService.createLocationFromCoords(currentLocation);

      // Mettre à jour l'utilisateur Marie (ID: 1) avec la position réelle
      await updateUserLocationForUser('1', newLocation);
    } catch (error) {
      console.error('Error updating Marie location:', error);
    }
  };

  /**
   * Mettre à jour la localisation d'un utilisateur spécifique
   */
  const updateUserLocationForUser = async (userId: string, location: Location) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;

      const updatedUser = {
        ...userToUpdate,
        location,
      };

      await StorageService.updateUser(userId, { location });

      // Mettre à jour dans la liste des utilisateurs
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? updatedUser : u))
      );

      // Si c'est l'utilisateur courant, mettre à jour aussi
      if (currentUser && currentUser.id === userId) {
        setCurrentUserState(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user location:', error);
    }
  };

  const value: AppContextType = {
    currentUser,
    users,
    appointments,
    isLoading,
    setCurrentUser,
    updateUserLocation,
    createAppointment,
    updateAppointmentStatus,
    addRating,
    getUsersNearby,
    getMyAppointments,
    getPendingAppointments,
    getUpcomingAppointments,
    getCompletedAppointments,
    getUserById,
    getAppointmentById,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook pour utiliser le contexte
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}