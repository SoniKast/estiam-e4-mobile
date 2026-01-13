import * as Location from 'expo-location';
import { Location as LocationType, User, UserWithDistance } from '@/types';

export class LocationService {
  /**
   * Demander les permissions de localisation
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Obtenir la position actuelle de l'utilisateur
   */
  static async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Location permission not granted');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Obtenir l'adresse à partir des coordonnées (reverse geocoding)
   */
  static async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<{ city: string; address: string } | null> {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        return {
          city: address.city || address.region || 'Ville inconnue',
          address: `${address.street || ''} ${address.streetNumber || ''}`.trim() || 'Adresse inconnue',
        };
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Calculer la distance entre deux points GPS (formule de Haversine)
   * @returns distance en kilomètres
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Arrondi à 1 décimale
  }

  /**
   * Convertir des degrés en radians
   */
  private static toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Filtrer les utilisateurs dans un rayon donné
   */
  static filterByRadius(
    users: User[],
    currentLocation: LocationType,
    radiusKm: number = 10
  ): UserWithDistance[] {
    return users
      .map((user) => {
        const distance = this.calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          user.location.latitude,
          user.location.longitude
        );

        return {
          ...user,
          distance,
        };
      })
      .filter((user) => user.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance); // Trier par distance croissante
  }

  /**
   * Surveiller la position de l'utilisateur (pour mise à jour en temps réel)
   */
  static async watchLocation(
    callback: (location: Location.LocationObject) => void
  ): Promise<Location.LocationSubscription | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Location permission not granted');
        return null;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 60000, // Mise à jour toutes les 60 secondes
          distanceInterval: 100, // Ou tous les 100 mètres
        },
        callback
      );

      return subscription;
    } catch (error) {
      console.error('Error watching location:', error);
      return null;
    }
  }

  /**
   * Créer un objet Location à partir d'une LocationObject
   */
  static async createLocationFromCoords(
    locationObject: Location.LocationObject
  ): Promise<LocationType> {
    const { latitude, longitude } = locationObject.coords;
    const addressInfo = await this.getAddressFromCoordinates(latitude, longitude);

    return {
      latitude,
      longitude,
      city: addressInfo?.city || 'Ville inconnue',
      address: addressInfo?.address,
      lastUpdated: new Date().toISOString(),
    };
  }
}