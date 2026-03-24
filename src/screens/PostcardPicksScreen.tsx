import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { postcardPicks } from '../data/PostcardLocation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PostcardDetail'>;
type PostcardItem = (typeof postcardPicks)[number];

export default function PostcardPicksScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');

  const filteredLocations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return postcardPicks;
    }

    return postcardPicks.filter(item => {
      const fullText = `${item.title} ${item.country}`.toLowerCase();
      return fullText.includes(value);
    });
  }, [search]);

  const renderCard = ({ item }: { item: PostcardItem }) => {
    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate('PostcardDetail', {
            itemId: item.id,
          })
        }
      >
        <ImageBackground
          source={item.image}
          resizeMode="cover"
          imageStyle={styles.cardImageStyle}
          style={styles.cardImage}
        >
          <View style={styles.cardTopRow}>
            <View style={styles.arrowWrap}>
              <Text style={styles.arrowText}>↗</Text>
            </View>
          </View>

          <View style={styles.cardBottom}>
            <Text style={styles.cardTitle}>
              {item.title}, {item.country}
            </Text>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Postcard Picks</Text>

        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search for a place..."
            placeholderTextColor="rgba(255,255,255,0.60)"
            style={styles.searchInput}
          />
        </View>

        <Text style={styles.sectionTitle}>Spotlight Stops</Text>

        <FlatList
          data={filteredLocations}
          keyExtractor={item => item.id}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A35C8',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A35C8',
    paddingHorizontal: 16,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 14,
  },
  searchWrap: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#001F7A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  searchIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 0,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  content: {
    paddingBottom: 110,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    height: 205,
  },
  cardImage: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardImageStyle: {
    borderRadius: 16,
  },
  cardTopRow: {
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingRight: 8,
  },
  arrowWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2B6DFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  cardBottom: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});