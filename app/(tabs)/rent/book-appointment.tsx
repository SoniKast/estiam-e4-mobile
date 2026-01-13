import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';
import { getFullName, generateId } from '@/utils/helpers';
import { FontAwesome } from '@expo/vector-icons';

export default function BookAppointment() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { getUserById, currentUser, createAppointment } = useApp();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const otherUser = getUserById(userId as string);

  if (!otherUser || !currentUser) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText>Erreur de chargement</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const handleSubmit = async () => {
    // Validation
    if (!date || !time) {
      Alert.alert('Erreur', 'Veuillez renseigner la date et l\'heure du rendez-vous');
      return;
    }

    // Validation du format de date (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert('Erreur', 'Format de date invalide. Utilisez YYYY-MM-DD (ex: 2026-01-15)');
      return;
    }

    // Validation du format d'heure (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(time)) {
      Alert.alert('Erreur', 'Format d\'heure invalide. Utilisez HH:MM (ex: 14:30)');
      return;
    }

    try {
      setIsSubmitting(true);

      // Déterminer qui est le renter et qui est le provider
      const isCurrentUserRenter = currentUser.userType === 'renter';
      
      await createAppointment({
        renterId: isCurrentUserRenter ? currentUser.id : otherUser.id,
        providerId: isCurrentUserRenter ? otherUser.id : currentUser.id,
        date,
        time,
        status: 'pending',
        service: service || undefined,
        notes: notes || undefined,
      });

      Alert.alert(
        'Succès',
        'Votre demande de rendez-vous a été envoyée !',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating appointment:', error);
      Alert.alert('Erreur', 'Impossible de créer le rendez-vous');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* En-tête */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Nouveau rendez-vous
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              avec {getFullName(otherUser.firstName, otherUser.lastName)}
            </ThemedText>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            {/* Date */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                Date <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <View style={styles.inputContainer}>
                <FontAwesome name="calendar" size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD (ex: 2026-01-15)"
                  placeholderTextColor="#9CA3AF"
                  value={date}
                  onChangeText={setDate}
                />
              </View>
              <ThemedText style={styles.hint}>Format: Année-Mois-Jour</ThemedText>
            </View>

            {/* Heure */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                Heure <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <View style={styles.inputContainer}>
                <FontAwesome name="clock-o" size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM (ex: 14:30)"
                  placeholderTextColor="#9CA3AF"
                  value={time}
                  onChangeText={setTime}
                />
              </View>
              <ThemedText style={styles.hint}>Format: Heure:Minutes (24h)</ThemedText>
            </View>

            {/* Service */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Service (optionnel)</ThemedText>
              <View style={styles.inputContainer}>
                <FontAwesome name="briefcase" size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Type de service"
                  placeholderTextColor="#9CA3AF"
                  value={service}
                  onChangeText={setService}
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Notes (optionnel)</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Informations complémentaires..."
                placeholderTextColor="#9CA3AF"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Boutons */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.secondaryButtonText}>Annuler</ThemedText>
            </Pressable>

            <Pressable
              style={[styles.button, styles.primaryButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.primaryButtonText}>
                {isSubmitting ? 'Envoi...' : 'Confirmer'}
              </ThemedText>
            </Pressable>
          </View>
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
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    minHeight: 100,
  },
  hint: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});