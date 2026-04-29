import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Camera } from 'expo-camera';

// Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';

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
const auth = getAuth(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [posts, setPosts] = useState([]);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleLike = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { likes: increment(1) });
  };

  const uploadPost = async () => {
    setPreviewVisible(false);
    const response = await fetch(capturedPhoto.uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `posts/${user.uid}_${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    await addDoc(collection(db, 'posts'), {
      user: user.displayName || user.email,
      image: url,
      likes: 0,
      caption: 'Publicado desde mi clon pro ✨',
      createdAt: serverTimestamp()
    });
  };

  if (!user) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.logoTitle}>InstaCloud</Text>
        <TextInput style={styles.input} placeholder="Nombre de usuario" value={displayName} onChangeText={setDisplayName} placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} placeholderTextColor="#999" />
        <TouchableOpacity style={styles.loginBtn} onPress={() => signInWithEmailAndPassword(auth, email, password)}>
          <Text style={styles.loginBtnText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => {
          const res = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(res.user, { displayName: displayName });
        }}>
          <Text style={styles.signupLink}>¿No tienes cuenta? <Text style={{fontWeight: 'bold'}}>Regístrate</Text></Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoTitleSmall}>InstaCloud</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setCameraVisible(true)} style={{marginRight: 15}}>
            <Text style={{fontSize: 22}}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => signOut(auth)}>
            <Text style={{fontSize: 22}}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <View style={styles.avatarPlaceholder} />
              <Text style={styles.postUsername}>{item.user}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <View style={styles.postActions}>
              <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionBtn}>
                <Text style={{fontSize: 20}}>❤️ {item.likes || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={{fontSize: 20}}>💬</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.postCaption}><Text style={{fontWeight: 'bold'}}>{item.user}</Text> {item.caption}</Text>
          </View>
        )}
      />

      <Modal visible={previewVisible}>
        <View style={{flex: 1, backgroundColor: '#000'}}>
          <Image source={{ uri: capturedPhoto?.uri }} style={{ flex: 1, resizeMode: 'contain' }} />
          <View style={styles.previewFooter}>
            <TouchableOpacity onPress={() => setPreviewVisible(false)} style={styles.cancelBtn}>
              <Text style={{color: '#fff'}}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={uploadPost} style={styles.shareBtn}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={cameraVisible}>
        <Camera style={{ flex: 1 }} ref={cameraRef}>
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.shutterBtn} onPress={async () => {
              const p = await cameraRef.current.takePictureAsync();
              setCapturedPhoto(p);
              setCameraVisible(false);
              setPreviewVisible(true);
            }} />
          </View>
        </Camera>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#dbdbdb', alignItems: 'center' },
  logoTitleSmall: { fontSize: 24, fontWeight: 'bold', letterSpacing: -1 },
  authContainer: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
  logoTitle: { fontSize: 42, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, letterSpacing: -2 },
  input: { backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#efefef', padding: 15, borderRadius: 8, marginBottom: 12, fontSize: 14 },
  loginBtn: { backgroundColor: '#0095f6', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  signupLink: { color: '#262626', textAlign: 'center', marginTop: 30, fontSize: 14 },
  postContainer: { marginBottom: 15 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#dbdbdb', marginRight: 10 },
  postUsername: { fontWeight: '600', fontSize: 14 },
  postImage: { width: '100%', height: 400, resizeMode: 'cover' },
  postActions: { flexDirection: 'row', padding: 10 },
  actionBtn: { marginRight: 15 },
  postCaption: { paddingHorizontal: 10, fontSize: 14, lineHeight: 18 },
  previewFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#000' },
  cancelBtn: { padding: 10 },
  shareBtn: { backgroundColor: '#0095f6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 },
  cameraControls: { flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 40 },
  shutterBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', borderWidth: 5, borderColor: '#ccc' }
});
