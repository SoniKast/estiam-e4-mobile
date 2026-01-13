import { AppointmentCard } from "@/components/AppointmentCard";
import { StarRating } from "@/components/StarRating";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useApp } from "@/context/AppContext";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OFFERERS = [
    {
        id: "1",
        type: "Loueur de service",
    },
    {
        id: "2",
        type: "Offreur de service",
    },
];

export default function RentScreen() {
    const { setCurrentUser, users, currentUser, getPendingAppointments, getUpcomingAppointments, getUserById } = useApp();
    const [selectedType, setSelectedType] = useState<'renter' | 'provider' | null>(null);

    // Fonction pour sélectionner un utilisateur de test
    const handleUserTypeSelection = async (userType: 'renter' | 'provider') => {
        // Trouver un utilisateur du type sélectionné dans les données de test
        const user = users.find(u => u.userType === userType);

        if (user) {
            await setCurrentUser(user);
            setSelectedType(userType);

            // Si c'est un loueur, naviguer vers offers
            if (userType === 'renter') {
                router.push("/rent/offers");
            }
            // Si c'est un offreur, on reste sur cette page qui affichera le dashboard
        }
    };

    const pendingAppointments = getPendingAppointments();
    const upcomingAppointments = getUpcomingAppointments();

    // Si un offreur est sélectionné, afficher le tableau de bord
    if (selectedType === 'provider' && currentUser) {
        return (
            <ThemedView style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* En-tête avec statistiques */}
                        <View style={{ padding: 16, paddingBottom: 8 }}>
                            <ThemedText type="title" style={{ marginBottom: 4 }}>
                                Tableau de bord
                            </ThemedText>
                            <ThemedText style={{ color: '#64748B', fontSize: 16 }}>
                                Bienvenue, {currentUser.firstName} !
                            </ThemedText>
                        </View>

                        {/* Carte de statistiques */}
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 16,
                            padding: 20,
                            marginHorizontal: 16,
                            marginBottom: 16,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            shadowColor: '#000',
                            shadowOpacity: 0.08,
                            shadowRadius: 10,
                            shadowOffset: { width: 0, height: 2 },
                            elevation: 4,
                        }}>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <ThemedText style={{ fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
                                    {currentUser.rating.toFixed(1)}
                                </ThemedText>
                                <StarRating rating={currentUser.rating} size={16} />
                                <ThemedText style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                                    Note moyenne
                                </ThemedText>
                            </View>

                            <View style={{ width: 1, backgroundColor: '#E5E7EB', marginHorizontal: 8 }} />

                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <ThemedText style={{ fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
                                    {currentUser.totalAppointments}
                                </ThemedText>
                                <ThemedText style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                                    Rendez-vous
                                </ThemedText>
                            </View>

                            <View style={{ width: 1, backgroundColor: '#E5E7EB', marginHorizontal: 8 }} />

                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <ThemedText style={{ fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
                                    {pendingAppointments.length}
                                </ThemedText>
                                <ThemedText style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                                    En attente
                                </ThemedText>
                            </View>
                        </View>

                        {/* Bouton pour voir les loueurs */}
                        <Pressable
                            style={{
                                backgroundColor: '#2563EB',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 16,
                                borderRadius: 12,
                                marginHorizontal: 16,
                                marginBottom: 24,
                                gap: 8,
                            }}
                            onPress={() => router.push('/rent/renters-nearby')}
                        >
                            <FontAwesome name="users" size={20} color="#fff" />
                            <ThemedText style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                                Voir les loueurs à proximité
                            </ThemedText>
                        </Pressable>

                        {/* Rendez-vous en attente */}
                        {pendingAppointments.length > 0 && (
                            <View style={{ marginBottom: 24, paddingHorizontal: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                                    <ThemedText type="subtitle" style={{ color: '#111827' }}>
                                        Demandes en attente
                                    </ThemedText>
                                    <View style={{
                                        backgroundColor: '#F59E0B',
                                        borderRadius: 12,
                                        paddingHorizontal: 8,
                                        paddingVertical: 2,
                                        minWidth: 24,
                                        alignItems: 'center',
                                    }}>
                                        <ThemedText style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                                            {pendingAppointments.length}
                                        </ThemedText>
                                    </View>
                                </View>

                                {pendingAppointments.map((appointment) => {
                                    const renter = getUserById(appointment.renterId);
                                    if (!renter) return null;

                                    return (
                                        <AppointmentCard
                                            key={appointment.id}
                                            appointment={appointment}
                                            otherUser={renter}
                                            onPress={() =>
                                                router.push({
                                                    pathname: '/rent/appointment-detail',
                                                    params: { appointmentId: appointment.id },
                                                })
                                            }
                                        />
                                    );
                                })}
                            </View>
                        )}

                        {/* Prochains rendez-vous */}
                        {upcomingAppointments.length > 0 && (
                            <View style={{ marginBottom: 24, paddingHorizontal: 16 }}>
                                <ThemedText type="subtitle" style={{ color: '#111827', marginBottom: 12 }}>
                                    Prochains rendez-vous
                                </ThemedText>

                                {upcomingAppointments.map((appointment) => {
                                    const renter = getUserById(appointment.renterId);
                                    if (!renter) return null;

                                    return (
                                        <AppointmentCard
                                            key={appointment.id}
                                            appointment={appointment}
                                            otherUser={renter}
                                            onPress={() =>
                                                router.push({
                                                    pathname: '/rent/appointment-detail',
                                                    params: { appointmentId: appointment.id },
                                                })
                                            }
                                        />
                                    );
                                })}
                            </View>
                        )}

                        {/* Message si aucun rendez-vous */}
                        {pendingAppointments.length === 0 && upcomingAppointments.length === 0 && (
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 48,
                                paddingHorizontal: 32,
                            }}>
                                <FontAwesome name="calendar-o" size={64} color="#D1D5DB" />
                                <ThemedText style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: '#111827',
                                    marginTop: 16,
                                    textAlign: 'center',
                                }}>
                                    Aucun rendez-vous pour le moment
                                </ThemedText>
                                <ThemedText style={{
                                    fontSize: 14,
                                    color: '#64748B',
                                    marginTop: 8,
                                    textAlign: 'center',
                                }}>
                                    Les loueurs peuvent vous contacter pour prendre rendez-vous
                                </ThemedText>
                            </View>
                        )}

                        {/* Bouton pour changer de type */}
                        <Pressable
                            style={{
                                marginHorizontal: 16,
                                marginBottom: 32,
                                paddingVertical: 12,
                                alignItems: 'center',
                            }}
                            onPress={() => setSelectedType(null)}
                        >
                            <ThemedText style={{ color: '#2563EB', fontSize: 14, fontWeight: '600' }}>
                                ← Changer de type d'utilisateur
                            </ThemedText>
                        </Pressable>
                    </ScrollView>
                </SafeAreaView>
            </ThemedView>
        );
    }

    // Affichage du choix initial
    return (
        <ThemedView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ThemedText type="title" style={{ margin: 16 }}>
                    Choix
                </ThemedText>

                <ThemedText type="title" style={{ marginHorizontal: 16, fontSize: 16 }}>
                    Vous êtes:
                </ThemedText>

                <FlatList
                    data={OFFERERS}
                    horizontal
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                padding: 8,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <Pressable
                                onPress={() => handleUserTypeSelection(item.id === "1" ? "renter" : "provider")}
                                style={{
                                    borderWidth: 2,
                                    borderColor: "#999b9f",
                                    backgroundColor: "#ebebec",
                                    paddingVertical: 64,
                                    paddingHorizontal: 8,
                                    borderRadius: 12,
                                    alignItems: "center",
                                }}
                            >
                                {item.id == "1" ?
                                    <FontAwesome name="user" size={48} color="black" /> :
                                    <FontAwesome name="users" size={48} color="black" />
                                }
                                <ThemedText style={{ color: "#121111ff", fontWeight: "600" }}>
                                    {item.type}
                                </ThemedText>
                            </Pressable>
                        </View>
                    )}
                />
            </SafeAreaView>
        </ThemedView>
    );
}