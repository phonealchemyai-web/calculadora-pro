import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput, Dimensions, StatusBar } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [view, setView] = useState('feed');
  const [posts, setPosts] = useState([
    { id: '1', user: 'User_Alpha', image: 'https://picsum.photos/800/800?random=1', caption: 'Vibras nocturnas 🌃' },
    { id: '2', user: 'Cyber_Dev', image: 'https://picsum.photos/800/800?random=2', caption: 'Programando en fucsia' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Estilo Premium */}
      <View style={styles.header}>
        <Text style={styles.logo}>INSTACLOUD</Text>
        <TouchableOpacity style={styles.iconCircle}>
          <Text style={{color: '#ff00ff', fontSize: 18}}>⚡</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.avatarGradient} />
              <Text style={styles.username}>{item.user}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <View style={styles.postFooter}>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Text style={styles.fucsiaIcon}>💗</Text>
                <Text style={styles.fucsiaIcon}>💬</Text>
                <Text style={styles.fucsiaIcon}>✈️</Text>
              </View>
              <Text style={styles.caption}><Text style={{fontWeight: 'bold'}}>{item.user}</Text> {item.caption}</Text>
            </View>
          </View>
        )}
      />

      {/* Nav Bar Fucsia */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setView('feed')}><Text style={styles.navIcon}>🏠</Text></TouchableOpacity>
        <TouchableOpacity style={styles.plusBtn}><Text style={styles.plusText}>+</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setView('profile')}><Text style={styles.navIcon}>👤</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' }, // Negro Mate
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#252525'
  },
  logo: { fontSize: 24, fontWeight: '900', color: '#ff00ff', letterSpacing: 2 },
  iconCircle: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#1f1f1f', justifyContent: 'center', alignItems: 'center' },
  postCard: { marginBottom: 15 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  avatarGradient: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#ff00ff', marginRight: 10 },
  username: { color: '#fff', fontWeight: '600' },
  postImage: { width: screenWidth, height: screenWidth, backgroundColor: '#1f1f1f' },
  postFooter: { padding: 12 },
  fucsiaIcon: { color: '#ff00ff', fontSize: 22, marginRight: 15 },
  caption: { color: '#fff', fontSize: 14 },
  navBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 15, 
    backgroundColor: '#000', 
    borderTopWidth: 1, 
    borderTopColor: '#252525',
    alignItems: 'center'
  },
  navIcon: { fontSize: 24, color: '#fff' },
  plusBtn: { 
    backgroundColor: '#ff00ff', 
    width: 50, 
    height: 35, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  plusText: { color: '#000', fontSize: 24, fontWeight: 'bold' }
});
