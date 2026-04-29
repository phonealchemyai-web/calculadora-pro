import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

const INITIAL_DATA = [
  { id: '1', user: 'coding_wizard', image: 'https://picsum.photos/id/10/500/500', likes: 124, caption: 'Mi primera app con GitHub y Expo! 🚀', liked: false },
  { id: '2', user: 'phone_alchemy', image: 'https://picsum.photos/id/20/500/500', likes: 89, caption: 'Programando desde el móvil. #DevLife', liked: false },
  { id: '3', user: 'react_native_fan', image: 'https://picsum.photos/id/30/500/500', likes: 256, caption: 'Aprendiendo a manejar listas. 📱', liked: false },
];

export default function App() {
  const [posts, setPosts] = useState(INITIAL_DATA);

  const handleLike = (id) => {
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const renderPost = ({ item }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.avatarMini} />
        <Text style={styles.username}>{item.user}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Text style={[styles.actionIcon, { color: item.liked ? 'red' : 'black' }]}>
            {item.liked ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity><Text style={styles.actionIcon}>💬</Text></TouchableOpacity>
      </View>
      <Text style={styles.likesText}>{item.likes} Me gusta</Text>
      <Text style={styles.caption}><Text style={styles.username}>{item.user}</Text> {item.caption}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Instagram</Text>
        <Text style={styles.headerIcon}>➕ ❤️ 💬</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#dbdbdb' },
  logo: { fontSize: 24, fontWeight: 'bold' },
  headerIcon: { fontSize: 20 },
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
