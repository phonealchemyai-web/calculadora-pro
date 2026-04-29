import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useFonts, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Tu configuración de Firebase vinculada a CSC
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

export default function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  let [fontsLoaded] = useFonts({ Fredoka_700Bold });

  // Escuchar mensajes en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      await addDoc(collection(db, 'chats'), {
        text: newMessage,
        user: 'Yo', // Aquí después pondremos el nombre del usuario logueado
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (e) {
      console.error("Error al enviar:", e);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>CSC MESSENGER</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.user === 'Yo' ? styles.myBubble : styles.otherBubble]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Escribe un mensaje chicle..." 
            placeholderTextColor="#666"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendText}>⚡</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 20, backgroundColor: '#000', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ff00ff22' },
  logo: { fontFamily: 'Fredoka_700Bold', fontSize: 26, color: '#ff00ff', textShadowColor: '#ff00ff', textShadowRadius: 10 },
  bubble: { padding: 15, borderRadius: 25, marginBottom: 12, maxWidth: '85%' },
  myBubble: { alignSelf: 'flex-end', backgroundColor: '#ff00ff', borderBottomRightRadius: 5 },
  otherBubble: { alignSelf: 'flex-start', backgroundColor: '#252525', borderBottomLeftRadius: 5 },
  msgText: { color: '#fff', fontFamily: 'Fredoka_700Bold', fontSize: 15 },
  inputContainer: { flexDirection: 'row', padding: 20, backgroundColor: '#000', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 30, paddingHorizontal: 20, height: 50, fontFamily: 'Fredoka_700Bold' },
  sendBtn: { marginLeft: 12, backgroundColor: '#ff00ff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  sendText: { fontSize: 22, color: '#000' }
});
