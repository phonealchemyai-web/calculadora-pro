import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [posts, setPosts] = useState([
    { id: '1', user: 'tu_usuario', image: 'https://picsum.photos/id/10/500/500', likes: 12, caption: '¡Mi primer post!', liked: false }
  ]);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted' && galleryStatus.status === 'granted');
    })();
  }, []);

  const addPost = (uri, caption) => {
    const newPost = {
      id: Date.now().toString(),
      user: 'yo_programador',
      image: uri,
      likes: 0,
      caption: caption,
      liked: false
    };
    setPosts([newPost, ...posts]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      addPost(result.assets[0].uri, 'Elegida desde la galería 🖼️');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      addPost(photo.uri, 'Nueva foto desde la cámara! 📸');
      setCameraVisible(false);
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No hay acceso a la cámara o galería</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Instagram Pro</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={pickImage} style={{marginRight: 15}}>
            <Text style={styles.iconText}>🖼️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCameraVisible(true)}>
            <Text style={styles.iconText}>📷</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <View style={styles.postHeader}><View style={styles.avatar} /><Text style={styles.username}>{item.user}</Text></View>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <Text style={styles.caption}><Text style={styles.username}>{item.user}</Text> {item.caption}</Text>
          </View>
        )}
      />

      <Modal visible={cameraVisible} animationType="slide">
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
              <View style={styles.innerCircle} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setCameraVisible(false)}>
              <Text style={{color: 'white'}}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#dbdbdb' },
  headerIcons: { flexDirection: 'row' },
  iconText: { fontSize: 26 },
  logo: { fontSize: 24, fontWeight: 'bold' },
  post: { marginBottom: 20 },
  postHeader: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#eee', marginRight: 10 },
  username: { fontWeight: 'bold' },
  postImage: { width: '100%', height: 400 },
  caption: { padding: 10 },
  camera: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  buttonContainer: { marginBottom: 30, alignItems: 'center' },
  captureBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'black' },
  closeBtn: { marginTop: 20, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10 }
});
