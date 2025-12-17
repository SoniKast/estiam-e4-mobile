import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
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
                                onPress={() => item.id == "1" ? router.push("/offers") : router.push("/")}
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
