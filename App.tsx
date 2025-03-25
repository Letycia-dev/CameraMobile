import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";

export default function App() {
  const [modo, setModo] = useState<CameraType>('back')
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef <CameraView>(null);
  const [foto, setFoto] = useState<string | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para mostrar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder permissão" />
      </View>
    );
  }

  function trocarCamera() {
    setModo((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function CompartilhaFoto() {
    if (!foto) {
      alert("Tire uma foto antes de compartilhar");
      return;
    }
    if (!(await Sharing.isAvailableAsync())) {
      alert("Ops, o compartilhamento não está disponível na sua plataforma!");
      return;
    }
    await Sharing.shareAsync(foto);
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={modo} ref={cameraRef}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={trocarCamera}>
            <Entypo name="cw" size={24} color={"white"} />
            <Text style={styles.text}>Alternar Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              if (cameraRef.current) {
                let photo = await cameraRef.current.takePictureAsync();
                console.log("foto", photo);
                setFoto(photo.uri);
              }
            }}
          >
            <Entypo name="camera" size={24} color={"white"} />
            <Text style={styles.text}>Tirar foto</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {foto && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: foto }} style={styles.fotoView} />
          <TouchableOpacity style={styles.shareButton} onPress={CompartilhaFoto}>
            <Entypo name="share" size={24} color={"white"} />
            <Text style={styles.shareText}>Compartilhar Foto</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: 'transparent',
    marginTop: 5,
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
  button: {
    flexDirection:'row',
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  text: {
    fontSize: 10,
    color: "white",
    marginTop: 5,
    fontWeight:'bold',
  },
  previewContainer: {
    flexDirection:'row',
    alignItems: "center",
    justifyContent:'center',
    marginTop: 20,
  },
  fotoView: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  shareButton: {
    flexDirection:'row',
    marginTop: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  shareText: {
    color: "white",
    marginTop: 5,
  },
});

