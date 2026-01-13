import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StarRating } from '@/components/StarRating';
import { useApp } from '@/context/AppContext';
import { getFullName } from '@/utils/helpers';
import { FontAwesome } from '@expo/vector-icons';

export default function UserProfile() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { getUserById, currentUser, getCompletedAppointments } = useApp();

  const user = getUserById(userId as string);
  const completedAppointments = getCompletedAppointments();

  // Filtrer les rendez-vous avec cet utilisateur
  const appointmentsWithUser = completedAppointments.filter(
    (apt) => apt.renterId === userId || apt.providerId === userId
  );

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText>Utilisateur non trouvé</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const canBookAppointment =
    currentUser &&
    currentUser.id !== user.id &&
    ((currentUser.userType === 'renter' && user.userType === 'provider') ||
      (currentUser.userType === 'provider' && user.userType === 'renter'));

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* En-tête du profil */}
          <View style={styles.header}>
            <View style={styles.avatarLarge} />
            <ThemedText type="title" style={styles.name}>
              {getFullName(user.firstName, user.lastName)}
            </ThemedText>
            <ThemedText style={styles.userType}>
              {user.userType === 'provider' ? 'Offreur de service' : 'Loueur de service'}
            </ThemedText>
          </View>

          {/* Statistiques */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{user.rating.toFixed(1)}</ThemedText>
                <StarRating rating={user.rating} size={18} />
                <ThemedText style={styles.statLabel}>Note moyenne</ThemedText>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{user.totalAppointments}</ThemedText>
                <ThemedText style={styles.statLabel}>Rendez-vous réalisés</ThemedText>
              </View>
            </View>
          </View>

          {/* Informations de contact */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Informations
            </ThemedText>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <FontAwesome name="map-marker" size={20} color="#64748B" />
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Localisation</ThemedText>
                  <ThemedText style={styles.infoValue}>
                    {user.location.city}
                    {user.location.address && ` • ${user.location.address}`}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <FontAwesome name="envelope" size={20} color="#64748B" />
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Email</ThemedText>
                  <ThemedText style={styles.infoValue}>{user.email}</ThemedText>
                </View>
              </View>

              {user.phone && (
                <>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoRow}>
                    <FontAwesome name="phone" size={20} color="#64748B" />
                    <View style={styles.infoContent}>
                      <ThemedText style={styles.infoLabel}>Téléphone</ThemedText>
                      <ThemedText style={styles.infoValue}>{user.phone}</ThemedText>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Historique des rendez-vous */}
          {appointmentsWithUser.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Historique
              </ThemedText>
              <ThemedText style={styles.historyText}>
                {appointmentsWithUser.length} rendez-vous réalisé
                {appointmentsWithUser.length > 1 ? 's' : ''} ensemble
              </ThemedText>
            </View>
          )}

          {/* Bouton d'action */}
          {canBookAppointment && (
            <View style={styles.actionContainer}>
              <Pressable
                style={styles.primaryButton}
                onPress={() =>
                  router.push({
                    pathname: '/rent/book-appointment',
                    params: { userId: user.id },
                  })
                }
              >
                <FontAwesome name="calendar-plus-o" size={20} color="#fff" />
                <ThemedText style={styles.primaryButtonText}>
                  Prendre rendez-vous
                </ThemedText>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
  },
  userType: {
    color: '#64748B',
    fontSize: 16,
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#111827',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  historyText: {
    color: '#64748B',
    fontSize: 14,
  },
  actionContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});