import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput, Dimensions } from 'react-native';

// Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

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
const auth = getAuth(app);
const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('feed'); // 'feed', 'search', 'profile'
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // Listener para el Feed
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  // Función de Búsqueda
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      // Nota: En producción usaríamos un índice de búsqueda, aquí filtramos el feed por ahora
      const filtered = posts.filter(p => p.user.toLowerCase().includes(text.toLowerCase()));
      setSearchResults(filtered);
    }
  };

  if (!user) return <View style={styles.container}><Text style={{marginTop:100, textAlign:'center'}}>Iniciando Sesión...</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Dinámico */}
      <View style={styles.header}>
        {view === 'search' ? (
          <TextInput 
            style={styles.searchBar} 
            placeholder="Buscar amigos..." 
            autoFocus
            value={searchText}
            onChangeText={handleSearch}
          />
        ) : (
          <Text style={styles.logoTitleSmall}>InstaCloud</Text>
        )}
        <TouchableOpacity onPress={() => signOut(auth)}><Text>🚪</Text></TouchableOpacity>
      </View>

      <View style={{flex: 1}}>
        {view === 'feed' && (
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <View style={{marginBottom: 20}}>
                <Text style={{fontWeight: 'bold', padding: 10}}>{item.user}</Text>
                <Image source={{ uri: item.image }} style={{width: '100%', height: 400}} />
              </View>
            )}
          />
        )}

        {view === 'search' && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.userResult}>
                <View style={styles.avatarSmall} />
                <Text style={{fontWeight: 'bold'}}>{item.user}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setView('feed')}><Text style={{fontSize: 24}}>🏠</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setView('search')}><Text style={{fontSize: 24}}>🔍</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setView('profile')}><Text style={{fontSize: 24}}>👤</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center', borderBottomWidth: 0.5, borderColor: '#dbdbdb' },
  logoTitleSmall: { fontSize: 22, fontWeight: 'bold' },
  searchBar: { flex: 1, backgroundColor: '#efefef', borderRadius: 10, padding: 8, marginRight: 15 },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, borderTopWidth: 0.5, borderColor: '#dbdbdb' },
  userResult: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#dbdbdb', marginRight: 15 }
});
