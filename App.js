import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

const DATA = [
  { id: '1', user: 'coding_wizard', image: 'https://picsum.photos/id/10/500/500', likes: 124, caption: 'Mi primera app con GitHub y Expo! 🚀' },
  { id: '2', user: 'phone_alchemy', image: 'https://picsum.photos/id/20/500/500', likes: 89, caption: 'Programando desde el móvil. #DevLife' },
  { id: '3', user: 'react_native_fan', image: 'https://picsum.photos/id/30/500/500', likes: 256, caption: 'Aprendiendo a manejar listas. 📱' },
];

const STORY_DATA = ['Tu historia', 'juan_dev', 'maria.ai', 'tech_guru', 'pixel_art'];

export default function App() {
  const renderPost = ({ item }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.avatarMini} />
        <Text style={styles.username}>{item.user}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postActions}>
        <TouchableOpacity><Text style={styles.actionIcon}>❤️</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.actionIcon}>💬</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.actionIcon}>✈️</Text></TouchableOpacity>
      </View>
      <Text style={styles.likesText}>{item.likes} Me gusta</Text>
      <Text style={styles.caption}><Text style={styles.username}>{item.user}</Text> {item.caption}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Instagram Clone</Text>
        <Text style={styles.headerIcon}>➕ ❤️ 💬</Text>
      </View>
      
      <FlatList
        data={DATA}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={STORY_DATA}
            renderItem={({ item }) => (
              <View style={styles.storyContainer}>
                <View style={styles.storyCircle} />
                <Text style={styles.storyText}>{item}</Text>
              </View>
            )}
            style={styles.storiesHeader}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#dbdbdb' },
  logo: { fontSize: 24, fontWeight: 'bold', fontFamily: 'serif' },
  headerIcon: { fontSize: 20 },
  storiesHeader: { paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#dbdbdb' },
  storyContainer: { alignItems: 'center', marginHorizontal: 10 },
  storyCircle: { width: 65, height: 65, borderRadius: 33, backgroundColor: '#f09433', borderWidth: 3, borderColor: '#fff' },
  storyText: { fontSize: 12, marginTop: 5 },
  post: { marginBottom: 15 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatarMini: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#dbdbdb', marginRight: 10 },
  username: { fontWeight: 'bold' },
  postImage: { width: '100%', height: 400 },
  postActions: { flexDirection: 'row', padding: 10 },
  actionIcon: { fontSize: 24, marginRight: 15 },
  likesText: { fontWeight: 'bold', marginLeft: 10 },
  caption: { marginLeft: 10, marginTop: 5 },
});
