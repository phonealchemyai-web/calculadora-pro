import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// Importaciones de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Tus credenciales reales de la captura 8302.jpg
const firebaseConfig = {
  apiKey: "AIzaSyDXkH65rdHX-OV506KOOwzmStow9daIyM",
  authDomain: "instagram-clone-d2647.firebaseapp.com",
  projectId: "instagram-clone-d2647",
  storageBucket: "instagram-clone-d2647.firebasestorage.app",
  messagingSenderId: "292841865361",
  appId: "1:292841865361:web:c9136b1b50ffcb9d38bf30"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef(null);

  // Escuchar cambios en la base de datos en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    });

    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted' && galleryStatus.status === 'granted');
    })();

    return () => unsubscribe();
  }, []);

  const uploadToFirebase = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `photo_${Date.now()}.jpg`;
      const storageRef = ref(storage, `posts/${filename}`);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'posts'), {
        user: 'Usuario_Pro',
        image: downloadURL,
        likes: 0,
        caption: 'Publicado desde mi App conectada! 🚀',
        createdAt: new Date().getTime()
      });
    } catch (e) {
      console.error(e);
      alert("Error al subir la foto");
    }
    setUploading(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) await uploadToFirebase(result.assets[0].uri);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      setCameraVisible(false);
      await uploadToFirebase(photo.uri);
    }
  };

  if (hasPermission === null) return <View style={styles.centered}><ActivityIndicator/></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>InstaCloud</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={pickImage} style={{marginRight: 15}}><Text style={styles.iconText}>🖼️</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setCameraVisible(true)}><Text style={styles.iconText}>📷</Text></TouchableOpacity>
        </View>
      </View>

      {uploading && <ActivityIndicator size="large" color="#0000ff" />}

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
          <TouchableOpacity style={styles.captureBtn} onPress={takePicture}><View style={styles.innerCircle} /></TouchableOpacity>
        </Camera>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  camera: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50 },
  captureBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'black' }
});
