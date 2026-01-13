import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { StarRating } from './StarRating';
import { UserWithDistance } from '@/types';
import { formatDistance, getFullName } from '@/utils/helpers';

interface UserCardProps {
  user: UserWithDistance;
  onPress?: () => void;
  showDistance?: boolean;
}

export function UserCard({ user, onPress, showDistance = true }: UserCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatar} />

        {/* Informations */}
        <View style={styles.info}>
          <ThemedText type="subtitle" style={styles.name}>
            {getFullName(user.firstName, user.lastName)}
          </ThemedText>
          
          <ThemedText style={styles.city}>
            {user.location.city}
            {showDistance && user.distance !== undefined && (
              <ThemedText style={styles.distance}>
                {' • '}
                {formatDistance(user.distance)}
              </ThemedText>
            )}
          </ThemedText>

          <View style={styles.ratingContainer}>
            <StarRating rating={user.rating} size={16} />
            <ThemedText style={styles.ratingText}>
              {user.rating.toFixed(1)} ({user.totalAppointments} rendez-vous)
            </ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#111827',
    marginBottom: 4,
  },
  city: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 8,
  },
  distance: {
    color: '#2563EB',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    color: '#64748B',
    fontSize: 12,
  },
});