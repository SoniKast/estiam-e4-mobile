import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();

    const [cameraFace, setCameraFace] = useState<CameraType>('back')
    const [flash, setFlash] = useState(false)
    const [mirror, setMirror] = useState(false)

    const cameraRef = useRef<CameraView>(null);

    function takePhoto() {
        cameraRef.current?.takePictureAsync({
            skipProcessing: true,
        }).then(photo => {
            console.log(photo);
        })
    }

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>Vous devez accepter l'utilisation de l'appareil photo</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.buttonAllowPhoto}>
                    <Text>Autoriser l'utilisation de l'appareil photo</Text>
                </TouchableOpacity>
            </View>
        );
    }
    return (
        <View style={{ flex: 1 }}>
            <Pressable style={{ flex: 1 }} onPress={() => takePhoto()}>
                <CameraView ref={cameraRef}
                    style={{ flex: 1 }}
                    facing={cameraFace}
                    enableTorch={flash}
                    mirror={mirror}>
                </CameraView>
            </Pressable>
            <View style={{ position: "absolute", right: 10, top: "50%", marginBottom: 60 }}>
                <TouchableOpacity onPress={() => setCameraFace(cameraFace === 'front' ? 'back' : 'front')}>
                    <MaterialIcons name="flip-camera-android" size={50} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setFlash(!flash)} style={{ marginTop: 20 }}>
                    <MaterialIcons name={flash ? "flash-on" : "flash-off"} size={50} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setMirror(!mirror)} style={{ marginTop: 40 }}>
                    <Octicons name="mirror" size={50} color="white" />
                </TouchableOpacity>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    buttonAllowPhoto: {
        borderRadius: 5,
        backgroundColor: "blue",
        padding: 5,
        margin: 10,
    }
});