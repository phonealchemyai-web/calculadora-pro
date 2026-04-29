import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput, Dimensions, KeyboardAvoidingView, Platform, StatusBar, ScrollView } from 'react-native';
import { useFonts, Fredoka_400Regular, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Config
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
const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [view, setView] = useState('feed'); 
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  let [fontsLoaded] = useFonts({ Fredoka_400Regular, Fredoka_700Bold });

  useEffect(() => {
    const qPosts = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const qChat = query(collection(db, 'chats'), orderBy('createdAt', 'asc'));
    const unSubPosts = onSnapshot(qPosts, (snap) => setPosts(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unSubChat = onSnapshot(qChat, (snap) => setMessages(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => { unSubPosts(); unSubChat(); };
  }, []);

  if (!fontsLoaded) return null;

  // COMPONENTE: HISTORIAS (STORIES)
  const Stories = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
      {['Tu Story', 'Alex', 'Maria', 'Dev_CSC', 'Neo'].map((name, i) => (
        <View key={i} style={styles.storyWrapper}>
          <View style={[styles.storyCircle, i === 0 && {borderColor: '#333'}]}>
            <View style={styles.innerStory} />
          </View>
          <Text style={styles.storyName}>{name}</Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>NEONIX</Text>
        <TouchableOpacity onPress={() => setView('chat')}><Text style={{fontSize: 22}}>💬</Text></TouchableOpacity>
      </View>

      <View style={{flex: 1}}>
        {view === 'feed' && (
          <FlatList
            ListHeaderComponent={<Stories />}
            data={posts.length > 0 ? posts : [{id: '1', user: 'Neonix_Bot', caption: '¡Bienvenido a la red! 🚀', image: 'https://picsum.photos/600'}]}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.postCard}>
                <View style={styles.postHeader}><View style={styles.miniAvatar} /><Text style={styles.username}>{item.user}</Text></View>
                <Image source={{uri: item.image}} style={styles.postImg} />
                <View style={styles.postActions}>
                  <Text style={styles.actionIcon}>💖</Text><Text style={styles.actionIcon}>💬</Text><Text style={styles.actionIcon}>⚡</Text>
                </View>
                <Text style={styles.caption}>{item.caption}</Text>
              </View>
            )}
          />
        )}

        {view === 'chat' && (
          <View style={{flex: 1}}>
            <FlatList
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View style={[styles.bubble, item.user === 'Yo' ? styles.myBubble : styles.otherBubble]}>
                  <Text style={styles.msgText}>{item.text}</Text>
                </View>
              )}
              contentContainerStyle={{padding: 20}}
            />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.inputBar}>
                <TextInput style={styles.input} placeholder="Mensaje..." placeholderTextColor="#666" value={inputText} onChangeText={setInputText} />
                <TouchableOpacity style={styles.sendBtn} onPress={async () => {
                  if(inputText.trim()){ await addDoc(collection(db, 'chats'), {text: inputText, user: 'Yo', createdAt: serverTimestamp()}); setInputText(''); }
                }}><Text style={{fontWeight: 'bold'}}>➤</Text></TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}

        {view === 'profile' && (
          <View style={styles.profileView}>
            <View style={styles.profileHeader}>
              <View style={styles.largeAvatar} />
              <Text style={styles.profileName}>User_Neonix</Text>
              <Text style={styles.profileBio}>Diseñando el futuro en Fucsia & Mate. 🍬</Text>
            </View>
            <View style={styles.grid}>
              {[1,2,3,4,5,6].map(i => <View key={i} style={styles.gridItem} />)}
            </View>
          </View>
        )}
      </View>

      {/* NAV BAR INFERIOR */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setView('feed')}><Text style={styles.navIcon}>{view === 'feed' ? '🏠' : '🏚️'}</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setView('chat')}><Text style={styles.navIcon}>{view === 'chat' ? '🟣' : '⚪'}</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setView('profile')}><Text style={styles.navIcon}>{view === 'profile' ? '👤' : '👤'}</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#000', alignItems: 'center' },
  logo: { fontFamily: 'Fredoka_700Bold', fontSize: 28, color: '#ff00ff', textShadowColor: '#ff00ff', textShadowRadius: 10 },
  storiesContainer: { paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  storyWrapper: { alignItems: 'center', marginHorizontal: 10 },
  storyCircle: { width: 65, height: 65, borderRadius: 32.5, borderWidth: 2, borderColor: '#ff00ff', padding: 3, justifyContent: 'center', alignItems: 'center' },
  innerStory: { width: '100%', height: '100%', borderRadius: 30, backgroundColor: '#333' },
  storyName: { color: '#fff', fontSize: 10, marginTop: 5, fontFamily: 'Fredoka_400Regular' },
  postCard: { marginBottom: 15 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  miniAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ff00ff', marginRight: 10 },
  username: { color: '#fff', fontFamily: 'Fredoka_700Bold' },
  postImg: { width: screenWidth, height: screenWidth, backgroundColor: '#1a1a1a' },
  postActions: { flexDirection: 'row', padding: 12 },
  actionIcon: { fontSize: 22, marginRight: 15 },
  caption: { color: '#bbb', paddingHorizontal: 12, fontFamily: 'Fredoka_400Regular' },
  bubble: { padding: 15, borderRadius: 25, marginBottom: 10, maxWidth: '80%' },
  myBubble: { alignSelf: 'flex-end', backgroundColor: '#ff00ff' },
  otherBubble: { alignSelf: 'flex-start', backgroundColor: '#222' },
  msgText: { color: '#fff', fontFamily: 'Fredoka_400Regular' },
  inputBar: { flexDirection: 'row', padding: 15, backgroundColor: '#000', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 25, paddingHorizontal: 15, height: 45 },
  sendBtn: { marginLeft: 10, backgroundColor: '#ff00ff', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#000', borderTopWidth: 0.5, borderTopColor: '#222' },
  navIcon: { fontSize: 22, color: '#fff' },
  profileView: { flex: 1, alignItems: 'center', paddingTop: 30 },
  largeAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ff00ff', marginBottom: 15 },
  profileName: { color: '#fff', fontSize: 22, fontFamily: 'Fredoka_700Bold' },
  profileBio: { color: '#888', marginTop: 5, fontFamily: 'Fredoka_400Regular' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 },
  gridItem: { width: screenWidth/3 - 2, height: screenWidth/3 - 2, backgroundColor: '#1a1a1a', margin: 1 }
});
