import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { Appointment, User } from '@/types';
import { formatDate, formatTime, getStatusColor, getStatusLabel, getFullName } from '@/utils/helpers';

interface AppointmentCardProps {
  appointment: Appointment;
  otherUser: User;
  onPress?: () => void;
  showActions?: boolean;
}

export function AppointmentCard({
  appointment,
  otherUser,
  onPress,
  showActions = false,
}: AppointmentCardProps) {
  const statusColor = getStatusColor(appointment.status);
  const statusLabel = getStatusLabel(appointment.status);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      {/* En-tête avec statut */}
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <ThemedText style={styles.statusText}>{statusLabel}</ThemedText>
        </View>
        <ThemedText style={styles.dateTime}>
          {formatDate(appointment.date)} • {formatTime(appointment.time)}
        </ThemedText>
      </View>

      {/* Informations utilisateur */}
      <View style={styles.userInfo}>
        <View style={styles.avatar} />
        <View style={styles.userDetails}>
          <ThemedText type="subtitle" style={styles.userName}>
            {getFullName(otherUser.firstName, otherUser.lastName)}
          </ThemedText>
          <ThemedText style={styles.userCity}>
            {otherUser.location.city}
          </ThemedText>
        </View>
      </View>

      {/* Service et notes */}
      {appointment.service && (
        <ThemedText style={styles.service}>
          Service: {appointment.service}
        </ThemedText>
      )}
      
      {appointment.notes && (
        <ThemedText style={styles.notes} numberOfLines={2}>
          {appointment.notes}
        </ThemedText>
      )}

      {/* Indicateur si notation disponible */}
      {appointment.status === 'completed' && (
        <View style={styles.ratingIndicator}>
          {appointment.renterRating && appointment.providerRating ? (
            <ThemedText style={styles.ratingText}>✓ Noté mutuellement</ThemedText>
          ) : (
            <ThemedText style={styles.ratingTextPending}>
              ⭐ En attente de notation
            </ThemedText>
          )}
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dateTime: {
    color: '#64748B',
    fontSize: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#111827',
    marginBottom: 2,
  },
  userCity: {
    color: '#64748B',
    fontSize: 14,
  },
  service: {
    color: '#111827',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  notes: {
    color: '#64748B',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  ratingIndicator: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  ratingText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingTextPending: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
  },
});