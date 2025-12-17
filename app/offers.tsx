import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    return (
        <ThemedView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ThemedText type="title" style={{ margin: 16 }}>
                    Offreurs près de vous
                </ThemedText>

                <FlatList
                    data={OFFERERS}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ justifyContent: 'center', flexGrow: 1, paddingHorizontal: 16 }}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: 16,
                                padding: 16,
                                marginBottom: 12,
                                shadowColor: "#000",
                                shadowOpacity: 0.08,
                                shadowRadius: 10,
                                elevation: 4,
                            }}
                        >
                            {/* Haut de la carte */}
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                {/* Avatar */}
                                <View
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 28,
                                        backgroundColor: "#E5E7EB",
                                        marginRight: 12,
                                    }}
                                />

                                {/* Infos */}
                                <View style={{ flex: 1 }}>
                                    <ThemedText type="subtitle" style={{ color: "#111827" }}>
                                        {item.firstName} {item.lastName}
                                    </ThemedText>
                                    <ThemedText style={{ color: "#64748B" }}>
                                        {item.city}
                                    </ThemedText>
                                </View>

                                {/* Note */}
                                <ThemedText>⭐ {item.rating}</ThemedText>
                            </View>

                            {/* Infos secondaires */}
                            <ThemedText style={{ marginTop: 8, color: "#64748B" }}>
                                {item.appointments} rendez-vous réalisés
                            </ThemedText>

                            {/* Bouton */}
                            <Pressable
                                style={{
                                    marginTop: 12,
                                    backgroundColor: "#2563EB",
                                    paddingVertical: 12,
                                    borderRadius: 12,
                                    alignItems: "center",
                                }}
                            >
                                <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
                                    Voir le profil
                                </ThemedText>
                            </Pressable>
                        </View>
                    )}
                />
            </SafeAreaView>
        </ThemedView>
    );
}
