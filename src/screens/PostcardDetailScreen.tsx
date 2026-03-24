import React, { useCallback, useMemo } from 'react';
import {
  Alert,
  ImageBackground,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { postcardPicks } from '../data/PostcardLocation';

type Props = NativeStackScreenProps<RootStackParamList, 'PostcardDetail'>;

export default function PostcardDetailScreen({ route, navigation }: Props) {
  const { itemId } = route.params;

  const item = useMemo(
    () => postcardPicks.find(entry => entry.id === itemId),
    [itemId],
  );

  const handleShare = useCallback(async () => {
    if (!item) {
      return;
    }

    const locationTitle = `${item.title}, ${item.country}`;
    const coordinatesText = `${item.coordinates.latitude.toFixed(4)}, ${item.coordinates.longitude.toFixed(4)}`;

    const message = [
      `Discover this place: ${locationTitle}`,
      '',
      `Why people love it: ${item.whyPeopleLoveIt}`,
      '',
      `Quick cultural note: ${item.quickCulturalNote}`,
      '',
      `What makes it special: ${item.whatMakesItSpecial}`,
      '',
      `Coordinates: ${coordinatesText}`,
    ].join('\n');

    try {
      await Share.share({
        title: locationTitle,
        message,
      });
    } catch {
      Alert.alert('Share error', 'Unable to open the share menu right now.');
    }
  }, [item]);

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.fallbackWrap}>
          <Text style={styles.fallbackText}>Location not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const locationTitle = `${item.title}, ${item.country}`;
  const coordinatesText = `${item.coordinates.latitude.toFixed(4)}, ${item.coordinates.longitude.toFixed(4)}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <View style={styles.topBar}>
          <Text style={styles.backCircle} onPress={() => navigation.goBack()}>
            ←
          </Text>

          <Text style={styles.headerTitle}>Details</Text>

          <Text style={styles.shareCircle} onPress={handleShare}>
            ↗
          </Text>
        </View>

        <ImageBackground
          source={item.image}
          resizeMode="cover"
          imageStyle={styles.heroImageStyle}
          style={styles.heroCard}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{locationTitle}</Text>

            <View style={styles.vibeWrap}>
              {item.travelerVibe.map(tag => (
                <View key={tag} style={styles.vibePill}>
                  <Text style={styles.vibeText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </ImageBackground>

        <View style={[styles.infoCard, styles.blueCard]}>
          <Text style={styles.infoTitle}>★ Why people love it</Text>
          <Text style={styles.infoText}>{item.whyPeopleLoveIt}</Text>
        </View>

        <View style={[styles.infoCard, styles.orangeCard]}>
          <Text style={styles.infoTitle}>🌍 Quick cultural note</Text>
          <Text style={styles.infoText}>{item.quickCulturalNote}</Text>
        </View>

        <View style={[styles.infoCard, styles.greenCard]}>
          <Text style={styles.infoTitle}>💎 What makes it special</Text>
          <Text style={styles.infoText}>{item.whatMakesItSpecial}</Text>
        </View>

        <View style={styles.coordinatesBlock}>
          <Text style={styles.coordinatesLabel}>Coordinates</Text>
          <Text style={styles.coordinatesValue}>{coordinatesText}</Text>
        </View>
      </ScrollView>
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
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 88,
  },
  fallbackWrap: {
    flex: 1,
    backgroundColor: '#0A35C8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  topBar: {
    marginTop: 4,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#001F7A',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 42,
    overflow: 'hidden',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  shareCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFD400',
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 42,
    overflow: 'hidden',
  },
  heroCard: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  heroImageStyle: {
    borderRadius: 16,
  },
  heroOverlay: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 28,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  vibeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  vibePill: {
    backgroundColor: '#4D88FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  vibeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  blueCard: {
    backgroundColor: '#2F65F2',
  },
  orangeCard: {
    backgroundColor: '#F05A17',
  },
  greenCard: {
    backgroundColor: '#12A43B',
  },
  infoTitle: {
    color: '#FFD400',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  coordinatesBlock: {
    marginTop: 2,
    paddingHorizontal: 4,
  },
  coordinatesLabel: {
    color: '#FFD400',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  coordinatesValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});