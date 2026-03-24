import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
  Easing,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const BG_ATLAS = require('../assets/images/atlas_bluefield.png');
const FLIGHT_MARKER = require('../assets/images/marker_flight_red.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const markerTranslateY = useRef(new Animated.Value(-260)).current;
  const markerTranslateX = useRef(new Animated.Value(70)).current;
  const markerRotate = useRef(new Animated.Value(0)).current;
  const markerScale = useRef(new Animated.Value(0.82)).current;
  const markerImpact = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(0)).current;
  const labelShift = useRef(new Animated.Value(18)).current;
  const pulse = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(markerTranslateY, {
          toValue: 0,
          duration: 1050,
          easing: Easing.bezier(0.2, 0.85, 0.22, 1),
          useNativeDriver: true,
        }),
        Animated.timing(markerTranslateX, {
          toValue: 0,
          duration: 1050,
          easing: Easing.bezier(0.2, 0.85, 0.22, 1),
          useNativeDriver: true,
        }),
        Animated.timing(markerRotate, {
          toValue: 1,
          duration: 1050,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(markerScale, {
          toValue: 1,
          duration: 1050,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(markerImpact, {
          toValue: 1,
          duration: 120,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(markerImpact, {
          toValue: 0,
          duration: 180,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.parallel([
      Animated.timing(labelOpacity, {
        toValue: 1,
        duration: 700,
        delay: 650,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(labelShift, {
        toValue: 0,
        duration: 700,
        delay: 650,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.03,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.96,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    //const timer = setTimeout(() => {
    //  navigation.replace('Intro');
    //}, 2400);

    //return () => clearTimeout(timer);
  }, [
    navigation,
    markerTranslateY,
    markerTranslateX,
    markerRotate,
    markerScale,
    markerImpact,
    labelOpacity,
    labelShift,
    pulse,
  ]);

  const rotation = markerRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-38deg', '-18deg'],
  });

  const impactShift = markerImpact.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const impactScale = markerImpact.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.94],
  });

  return (
    <View style={styles.screen}>
      <ImageBackground source={BG_ATLAS} style={styles.background} resizeMode="cover">
        <View style={styles.dimLayer} />

        <View style={styles.centerZone}>
          <Animated.Image
            source={FLIGHT_MARKER}
            resizeMode="contain"
            style={[
              styles.marker,
              {
                transform: [
                  { translateX: markerTranslateX },
                  { translateY: Animated.add(markerTranslateY, impactShift) },
                  { rotate: rotation },
                  { scale: Animated.multiply(markerScale, impactScale) },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.loadingWrap,
              {
                opacity: labelOpacity,
                transform: [{ translateY: labelShift }, { scale: pulse }],
              },
            ]}
          >
            <Text style={styles.loadingText}>Loading . . .</Text>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#08112C',
  },
  background: {
    flex: 1,
  },
  dimLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 10, 28, 0.10)',
  },
  centerZone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    width: 168,
    height: 168,
    marginBottom: 34,
  },
  loadingWrap: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});