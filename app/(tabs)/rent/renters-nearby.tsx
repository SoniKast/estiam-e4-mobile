import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserCard } from '@/components/UserCard';
import { useApp } from '@/context/AppContext';
import { FontAwesome } from '@expo/vector-icons';

export default function RentersNearby() {
  const { getUsersNearby } = useApp();
  const nearbyRenters = getUsersNearby(10); // Rayon de 10km

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Loueurs à proximité
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Dans un rayon de 10 km
          </ThemedText>
        </View>

        {nearbyRenters.length > 0 ? (
          <FlatList
            data={nearbyRenters}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <UserCard
                user={item}
                onPress={() =>
                  router.push({
                    pathname: '/rent/user-profile',
                    params: { userId: item.id },
                  })
                }
                showDistance={true}
              />
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="map-marker" size={64} color="#D1D5DB" />
            <ThemedText style={styles.emptyStateText}>
              Aucun loueur à proximité
            </ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>
              Essayez d'élargir votre rayon de recherche ou revenez plus tard
            </ThemedText>
          </View>
        )}
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
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
});