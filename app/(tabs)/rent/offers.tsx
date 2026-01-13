import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { UserCard } from "@/components/UserCard";
import { useApp } from "@/context/AppContext";
import { router } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

const OFFERERS = [
    {
        id: "1",
        firstName: "Marie",
        lastName: "Dupont",
        city: "Paris",
        rating: 4.5,
        appointments: 27,
    },
    {
        id: "2",
        firstName: "Paul",
        lastName: "Martin",
        city: "Paris",
        rating: 4.0,
        appointments: 12,
    },
    {
        id: "3",
        firstName: "Sophie",
        lastName: "Leroy",
        city: "Paris",
        rating: 5,
        appointments: 41,
    },
    {
        id: "4",
        firstName: "Bruno",
        lastName: "Leroy",
        city: "Paris",
        rating: 5,
        appointments: 44,
    },
    {
        id: "5",
        firstName: "Caroline",
        lastName: "Leroy",
        city: "Paris",
        rating: 5,
        appointments: 22,
    },
];

export default function OffersScreen() {
    const { getUsersNearby } = useApp();
    const nearbyProviders = getUsersNearby(10); // Rayon de 10km

    return (
        <ThemedView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ThemedText type="title" style={{ margin: 16 }}>
                    Offreurs près de vous
                </ThemedText>
                <ThemedText style={{ marginHorizontal: 16, marginBottom: 16, color: '#64748B', fontSize: 14 }}>
                    Dans un rayon de 10 km
                </ThemedText>

                {nearbyProviders.length > 0 ? (
                    <FlatList
                        data={nearbyProviders}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
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
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 32,
                    }}>
                        <FontAwesome name="map-marker" size={64} color="#D1D5DB" />
                        <ThemedText style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: '#111827',
                            marginTop: 16,
                            textAlign: 'center',
                        }}>
                            Aucun offreur à proximité
                        </ThemedText>
                        <ThemedText style={{
                            fontSize: 14,
                            color: '#64748B',
                            marginTop: 8,
                            textAlign: 'center',
                        }}>
                            Essayez d'élargir votre rayon de recherche ou revenez plus tard
                        </ThemedText>
                    </View>
                )}
            </SafeAreaView>
        </ThemedView>
    );
}
