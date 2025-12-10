import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type message = {
    user: string,
    text: string
}

export default function ChatScreen() {

    const conversation: message[] = [
        {
            user: "John",
            text: "Hello",
        },
        {
            user: "bot",
            text: "Hello John"
        }
    ]

    const styleMessagesBot = {
        backgroundColor: "darkgrey",
        color: "white",
    }

    const styleMessagesUser = {
        backgroundColor: "lightgrey",
        color: "black",
        textAlign: "right",
        alignSelf: "flex-end"
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ThemedText type="title">
                    Chat bot
                </ThemedText>
                <FlatList style={styles.dialog} data={conversation} renderItem={({ item }) => {
                    return (
                        <View style={[styles.message, item.user === "bot" ? styleMessagesBot : styleMessagesUser]}>
                            <Text style={item.user === "bot" ? styleMessagesBot : styleMessagesUser}>
                                {item.text}
                            </Text>
                        </View>
                    )
                }}>
                </FlatList>
                <View style={styles.textInputContainer}>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={3}
                        style={styles.textInput}
                        placeholder="De quoi voulez-vous parler ?"
                    />
                    <View style={styles.containerButton}>
                        <TouchableOpacity style={styles.buttonSend}>
                            <FontAwesome name="send" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonCamera}>
                            <Link href="/camera">
                                <FontAwesome name="camera" size={24} color="white" />
                            </Link>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    containerButton: {
        width: 60,
    },
    buttonSend: {
        marginHorizontal: 10,
        marginTop: 5,
        paddingTop: 8,
        paddingStart: 6,
        height: 40,
        width: 40,
        borderRadius: 40,
        backgroundColor: "#aaa"
    },
    buttonCamera: {
        marginHorizontal: 10,
        marginTop: 10,
        paddingTop: 8,
        paddingStart: 7,
        height: 40,
        width: 40,
        borderRadius: 40,
        backgroundColor: "#aaa"
    },
    textInputContainer: {
        height: 100,
        flexDirection: "row",
    },
    textInput: {
        borderColor: '#eee',
        borderWidth: 1,
        flex: 1
    },
    message: {
        borderRadius: 15,
        padding: 10,
        margin: 10,
        alignSelf: 'flex-start' // pour que le contenu définisse la taille du conteneur
    },
    dialog: {
        flex: 1,
    }
});