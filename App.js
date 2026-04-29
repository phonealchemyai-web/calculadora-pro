import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  const [posts, setPosts] = useState([]);
  const [commentModal, setCommentModal] = useState({ visible: false, postId: null });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  // Escuchar comentarios del post seleccionado
  useEffect(() => {
    if (commentModal.postId) {
      const q = query(collection(db, 'posts', commentModal.postId, 'comments'), orderBy('createdAt', 'asc'));
      return onSnapshot(q, (snapshot) => {
        setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    }
  }, [commentModal.postId]);

  const sendComment = async () => {
    if (newComment.trim() === '') return;
    await addDoc(collection(db, 'posts', commentModal.postId, 'comments'), {
      text: newComment,
      user: 'Usuario_Anonimo',
      createdAt: serverTimestamp()
    });
    setNewComment('');
  };

  const uploadToFirebase = async (uri) => {
    setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `posts/photo_${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    await addDoc(collection(db, 'posts'), {
      user: 'Phone_Dev',
      image: url,
      caption: 'Publicado con comentarios! 💬',
      createdAt: serverTimestamp()
    });
    setUploading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>InstaCloud 2.0</Text>
        <TouchableOpacity onPress={() => setCameraVisible(true)}><Text style={styles.iconText}>📷</Text></TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <View style={styles.postHeader}><Text style={styles.username}>{item.user}</Text></View>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => setCommentModal({ visible: true, postId: item.id })}>
                <Text style={styles.iconText}>💬</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      />

      {/* Modal de Comentarios */}
      <Modal visible={commentModal.visible} animationType="slide">
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setCommentModal({ visible: false, postId: null })}><Text>Cerrar</Text></TouchableOpacity>
            <Text style={{fontWeight: 'bold'}}>Comentarios</Text>
            <View width={50}/>
          </View>
          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={{fontWeight: 'bold'}}>{item.user}: </Text>
                <Text>{item.text}</Text>
              </View>
            )}
            style={{padding: 20}}
          />
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.inputArea}>
              <TextInput 
                style={styles.input} 
                placeholder="Escribe un comentario..." 
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity onPress={sendComment}><Text style={{color: '#0095f6', fontWeight: 'bold'}}>Publicar</Text></TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Modal Cámara */}
      <Modal visible={cameraVisible}>
        <Camera style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}} ref={cameraRef}>
          <TouchableOpacity style={styles.captureBtn} onPress={async () => {
            const p = await cameraRef.current.takePictureAsync();
            setCameraVisible(false);
            uploadToFirebase(p.uri);
          }}><View style={styles.innerCircle}/></TouchableOpacity>
        </Camera>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#dbdbdb' },
  logo: { fontSize: 24, fontWeight: 'bold' },
  iconText: { fontSize: 24, paddingHorizontal: 10 },
  post: { marginBottom: 20 },
  postHeader: { padding: 10 },
  username: { fontWeight: 'bold' },
  postImage: { width: '100%', height: 400 },
  actions: { flexDirection: 'row', padding: 10 },
  caption: { paddingHorizontal: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 0.5 },
  commentItem: { flexDirection: 'row', marginBottom: 10 },
  inputArea: { flexDirection: 'row', padding: 15, borderTopWidth: 0.5, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10 },
  captureBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', marginBottom: 40, justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 60, height: 60, borderRadius: 30, borderWeight: 2, borderColor: 'black' }
});
