import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StarRating } from '@/components/StarRating';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime, getStatusColor, getStatusLabel, getFullName } from '@/utils/helpers';
import { FontAwesome } from '@expo/vector-icons';

export default function AppointmentDetail() {
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const {
    getAppointmentById,
    getUserById,
    currentUser,
    updateAppointmentStatus,
    addRating,
  } = useApp();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appointment = getAppointmentById(appointmentId as string);
  
  if (!appointment || !currentUser) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText>Rendez-vous non trouvé</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const isProvider = currentUser.id === appointment.providerId;
  const otherUserId = isProvider ? appointment.renterId : appointment.providerId;
  const otherUser = getUserById(otherUserId);

  if (!otherUser) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText>Utilisateur non trouvé</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const myRating = isProvider ? appointment.providerRating : appointment.renterRating;
  const otherRating = isProvider ? appointment.renterRating : appointment.providerRating;
  const canRate = appointment.status === 'completed' && !myRating;
  const canConfirm = appointment.status === 'pending' && isProvider;
  const canCancel = appointment.status === 'pending' || appointment.status === 'confirmed';

  const handleConfirm = async () => {
    Alert.alert(
      'Confirmer le rendez-vous',
      'Voulez-vous confirmer ce rendez-vous ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              await updateAppointmentStatus(appointment.id, 'confirmed');
              Alert.alert('Succès', 'Rendez-vous confirmé !');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de confirmer le rendez-vous');
            }
          },
        },
      ]
    );
  };

  const handleCancel = async () => {
    Alert.alert(
      'Annuler le rendez-vous',
      'Voulez-vous vraiment annuler ce rendez-vous ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateAppointmentStatus(appointment.id, 'cancelled');
              Alert.alert('Rendez-vous annulé', '', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'annuler le rendez-vous');
            }
          },
        },
      ]
    );
  };

  const handleSubmitRating = async () => {
    try {
      setIsSubmitting(true);

      await addRating(
        appointment.id,
        {
          score: ratingScore,
          comment: ratingComment || undefined,
          createdAt: new Date().toISOString(),
          createdBy: currentUser.id,
        },
        isProvider
      );

      setShowRatingModal(false);
      Alert.alert('Merci !', 'Votre note a été enregistrée');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer la note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColor = getStatusColor(appointment.status);
  const statusLabel = getStatusLabel(appointment.status);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Statut */}
          <View style={styles.header}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <ThemedText style={styles.statusText}>{statusLabel}</ThemedText>
            </View>
          </View>

          {/* Informations du rendez-vous */}
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <FontAwesome name="calendar" size={24} color="#2563EB" />
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Date</ThemedText>
                  <ThemedText style={styles.infoValue}>{formatDate(appointment.date)}</ThemedText>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <FontAwesome name="clock-o" size={24} color="#2563EB" />
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Heure</ThemedText>
                  <ThemedText style={styles.infoValue}>{formatTime(appointment.time)}</ThemedText>
                </View>
              </View>

              {appointment.service && (
                <>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoRow}>
                    <FontAwesome name="briefcase" size={24} color="#2563EB" />
                    <View style={styles.infoContent}>
                      <ThemedText style={styles.infoLabel}>Service</ThemedText>
                      <ThemedText style={styles.infoValue}>{appointment.service}</ThemedText>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Informations de l'autre utilisateur */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {isProvider ? 'Loueur' : 'Offreur'}
            </ThemedText>
            <View style={styles.userCard}>
              <View style={styles.avatar} />
              <View style={styles.userInfo}>
                <ThemedText type="subtitle" style={styles.userName}>
                  {getFullName(otherUser.firstName, otherUser.lastName)}
                </ThemedText>
                <ThemedText style={styles.userCity}>{otherUser.location.city}</ThemedText>
                <View style={styles.ratingContainer}>
                  <StarRating rating={otherUser.rating} size={16} />
                  <ThemedText style={styles.ratingText}>
                    {otherUser.rating.toFixed(1)}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Notes */}
          {appointment.notes && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Notes
              </ThemedText>
              <View style={styles.notesCard}>
                <ThemedText style={styles.notesText}>{appointment.notes}</ThemedText>
              </View>
            </View>
          )}

          {/* Notations */}
          {(myRating || otherRating) && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Notations
              </ThemedText>

              {myRating && (
                <View style={styles.ratingCard}>
                  <ThemedText style={styles.ratingCardTitle}>Votre note</ThemedText>
                  <StarRating rating={myRating.score} size={20} />
                  {myRating.comment && (
                    <ThemedText style={styles.ratingCardComment}>{myRating.comment}</ThemedText>
                  )}
                </View>
              )}

              {otherRating && (
                <View style={styles.ratingCard}>
                  <ThemedText style={styles.ratingCardTitle}>
                    Note de {otherUser.firstName}
                  </ThemedText>
                  <StarRating rating={otherRating.score} size={20} />
                  {otherRating.comment && (
                    <ThemedText style={styles.ratingCardComment}>{otherRating.comment}</ThemedText>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {canConfirm && (
              <Pressable style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
                <FontAwesome name="check" size={20} color="#fff" />
                <ThemedText style={styles.buttonText}>Confirmer</ThemedText>
              </Pressable>
            )}

            {canRate && (
              <Pressable
                style={[styles.button, styles.rateButton]}
                onPress={() => setShowRatingModal(true)}
              >
                <FontAwesome name="star" size={20} color="#fff" />
                <ThemedText style={styles.buttonText}>Noter</ThemedText>
              </Pressable>
            )}

            {canCancel && (
              <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <FontAwesome name="times" size={20} color="#fff" />
                <ThemedText style={styles.buttonText}>Annuler</ThemedText>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal de notation */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Noter {otherUser.firstName}
            </ThemedText>

            <View style={styles.modalRating}>
              <StarRating
                rating={ratingScore}
                size={40}
                editable
                onRatingChange={setRatingScore}
              />
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Commentaire (optionnel)"
              placeholderTextColor="#9CA3AF"
              value={ratingComment}
              onChangeText={setRatingComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowRatingModal(false)}
                disabled={isSubmitting}
              >
                <ThemedText style={styles.modalCancelText}>Annuler</ThemedText>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.modalSubmitButton]}
                onPress={handleSubmitRating}
                disabled={isSubmitting}
              >
                <ThemedText style={styles.modalSubmitText}>
                  {isSubmitting ? 'Envoi...' : 'Valider'}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 16,
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
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#111827',
    marginBottom: 4,
  },
  userCity: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    color: '#64748B',
    fontSize: 14,
  },
  notesCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  notesText: {
    color: '#111827',
    fontSize: 14,
    fontStyle: 'italic',
  },
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  ratingCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  ratingCardComment: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    fontStyle: 'italic',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  confirmButton: {
    backgroundColor: '#10B981',
  },
  rateButton: {
    backgroundColor: '#F59E0B',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#111827',
  },
  modalRating: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    minHeight: 100,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F3F4F6',
  },
  modalCancelText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSubmitButton: {
    backgroundColor: '#2563EB',
  },
  modalSubmitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});