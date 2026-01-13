import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Appointment, Rating } from '@/types';

export class StorageService {
  // Clés de stockage
  private static KEYS = {
    CURRENT_USER: '@current_user',
    USERS: '@users',
    APPOINTMENTS: '@appointments',
  };

  // ==================== UTILISATEUR COURANT ====================

  /**
   * Sauvegarder l'utilisateur courant
   */
  static async saveCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving current user:', error);
      throw error;
    }
  }

  /**
   * Récupérer l'utilisateur courant
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(this.KEYS.CURRENT_USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Supprimer l'utilisateur courant (déconnexion)
   */
  static async clearCurrentUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.KEYS.CURRENT_USER);
    } catch (error) {
      console.error('Error clearing current user:', error);
      throw error;
    }
  }

  // ==================== GESTION DES UTILISATEURS ====================

  /**
   * Sauvegarder tous les utilisateurs
   */
  static async saveUsers(users: User[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les utilisateurs
   */
  static async getUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(this.KEYS.USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  /**
   * Ajouter un nouvel utilisateur
   */
  static async addUser(user: User): Promise<void> {
    try {
      const users = await this.getUsers();
      users.push(user);
      await this.saveUsers(users);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un utilisateur
   */
  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await this.saveUsers(users);

        // Si c'est l'utilisateur courant, le mettre à jour aussi
        const currentUser = await this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          await this.saveCurrentUser(users[userIndex]);
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Récupérer un utilisateur par son ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      return users.find((u) => u.id === userId) || null;
    } catch (error) {
      console.error('Error getting user by id:', error);
      return null;
    }
  }

  // ==================== GESTION DES RENDEZ-VOUS ====================

  /**
   * Sauvegarder tous les rendez-vous
   */
  static async saveAppointments(appointments: Appointment[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (error) {
      console.error('Error saving appointments:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les rendez-vous
   */
  static async getAppointments(): Promise<Appointment[]> {
    try {
      const appointmentsJson = await AsyncStorage.getItem(this.KEYS.APPOINTMENTS);
      return appointmentsJson ? JSON.parse(appointmentsJson) : [];
    } catch (error) {
      console.error('Error getting appointments:', error);
      return [];
    }
  }

  /**
   * Ajouter un nouveau rendez-vous
   */
  static async addAppointment(appointment: Appointment): Promise<void> {
    try {
      const appointments = await this.getAppointments();
      appointments.push(appointment);
      await this.saveAppointments(appointments);
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un rendez-vous
   */
  static async updateAppointment(
    appointmentId: string,
    updates: Partial<Appointment>
  ): Promise<void> {
    try {
      const appointments = await this.getAppointments();
      const appointmentIndex = appointments.findIndex((a) => a.id === appointmentId);

      if (appointmentIndex !== -1) {
        appointments[appointmentIndex] = {
          ...appointments[appointmentIndex],
          ...updates,
        };
        await this.saveAppointments(appointments);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  /**
   * Récupérer un rendez-vous par son ID
   */
  static async getAppointmentById(appointmentId: string): Promise<Appointment | null> {
    try {
      const appointments = await this.getAppointments();
      return appointments.find((a) => a.id === appointmentId) || null;
    } catch (error) {
      console.error('Error getting appointment by id:', error);
      return null;
    }
  }

  /**
   * Récupérer les rendez-vous d'un utilisateur
   */
  static async getUserAppointments(userId: string): Promise<Appointment[]> {
    try {
      const appointments = await this.getAppointments();
      return appointments.filter(
        (a) => a.renterId === userId || a.providerId === userId
      );
    } catch (error) {
      console.error('Error getting user appointments:', error);
      return [];
    }
  }

  // ==================== GESTION DES NOTATIONS ====================

  /**
   * Ajouter une notation à un rendez-vous
   */
  static async addRating(
    appointmentId: string,
    rating: Rating,
    isProvider: boolean
  ): Promise<void> {
    try {
      const appointments = await this.getAppointments();
      const appointmentIndex = appointments.findIndex((a) => a.id === appointmentId);

      if (appointmentIndex !== -1) {
        if (isProvider) {
          appointments[appointmentIndex].providerRating = rating;
        } else {
          appointments[appointmentIndex].renterRating = rating;
        }
        await this.saveAppointments(appointments);

        // Mettre à jour la note moyenne de l'utilisateur noté
        const appointment = appointments[appointmentIndex];
        const ratedUserId = isProvider ? appointment.providerId : appointment.renterId;
        await this.updateUserRating(ratedUserId);
      }
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour la note moyenne d'un utilisateur
   */
  private static async updateUserRating(userId: string): Promise<void> {
    try {
      const appointments = await this.getAppointments();
      const user = await this.getUserById(userId);

      if (!user) return;

      // Récupérer toutes les notes de cet utilisateur
      const ratings: Rating[] = [];
      appointments.forEach((appointment) => {
        if (appointment.providerId === userId && appointment.providerRating) {
          ratings.push(appointment.providerRating);
        } else if (appointment.renterId === userId && appointment.renterRating) {
          ratings.push(appointment.renterRating);
        }
      });

      // Calculer la moyenne
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, r) => acc + r.score, 0);
        const averageRating = Math.round((sum / ratings.length) * 10) / 10;

        await this.updateUser(userId, {
          rating: averageRating,
          totalAppointments: appointments.filter(
            (a) =>
              (a.providerId === userId || a.renterId === userId) &&
              a.status === 'completed'
          ).length,
        });
      }
    } catch (error) {
      console.error('Error updating user rating:', error);
    }
  }

  // ==================== UTILITAIRES ====================

  /**
   * Réinitialiser toutes les données (pour développement/test)
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.KEYS.CURRENT_USER,
        this.KEYS.USERS,
        this.KEYS.APPOINTMENTS,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  /**
   * Vérifier si des données existent
   */
  static async hasData(): Promise<boolean> {
    try {
      const users = await this.getUsers();
      return users.length > 0;
    } catch (error) {
      console.error('Error checking data:', error);
      return false;
    }
  }
}