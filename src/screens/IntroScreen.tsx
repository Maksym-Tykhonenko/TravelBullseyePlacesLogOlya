import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ImageBackground,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const BG_ATLAS = require('../assets/images/atlas_bluefield.png');
const PANEL_ART_A = require('../assets/images/trail_intro_scene_a.png');
const PANEL_ART_B = require('../assets/images/route_story_board_b.png');
const PANEL_ART_C = require('../assets/images/memory_sketch_set_c.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;

type IntroCard = {
  id: number;
  image: any;
  title: string;
  description: string;
  buttonLabel: string;
};

const INTRO_STEPS: IntroCard[] = [
  {
    id: 0,
    image: PANEL_ART_A,
    title: 'Find Places Worth the Bullseye',
    description:
      'Discover popular travel spots, cultural landmarks, and unforgettable views from around the world. Every place can become your next destination or your favorite memory.',
    buttonLabel: 'Next',
  },
  {
    id: 1,
    image: PANEL_ART_B,
    title: 'Mark Your Map With Darts',
    description:
      'Drop a red dart on places you have visited and a green dart on the ones waiting on your list. Add notes and turn your map into a personal travel story.',
    buttonLabel: 'Next',
  },
  {
    id: 2,
    image: PANEL_ART_C,
    title: 'Turn Trips Into Stories',
    description:
      'Test what you know about places, culture, and travel traditions, then relax with a creative sketch activity inspired by travel scenes and memorable views.',
    buttonLabel: 'Start Exploring',
  },
];

export default function IntroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const [stepIndex, setStepIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const riseAnim = useRef(new Animated.Value(28)).current;
  const imageScale = useRef(new Animated.Value(0.92)).current;
  const imageFloat = useRef(new Animated.Value(0)).current;

  const isSmall = height < 760;
  const isVerySmall = height < 700;

  const current = useMemo(() => INTRO_STEPS[stepIndex], [stepIndex]);

  const artWidth = Math.min(width * 0.72, 300);
  const artHeight = artWidth * 0.92;

  const panelRadius = isVerySmall ? 18 : 22;
  const panelPadH = isVerySmall ? 16 : 20;
  const panelPadTop = isVerySmall ? 18 : 20;
  const panelPadBottom = isVerySmall ? 16 : 18;

  React.useEffect(() => {
    fadeAnim.setValue(0);
    riseAnim.setValue(28);
    imageScale.setValue(0.92);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 460,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(riseAnim, {
        toValue: 0,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [stepIndex, fadeAnim, riseAnim, imageScale]);

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(imageFloat, {
          toValue: -8,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(imageFloat, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [imageFloat]);

  const onNextPress = () => {
    if (stepIndex < INTRO_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    navigation.replace('MainTabs');
  };

  return (
    <ImageBackground source={BG_ATLAS} resizeMode="cover" style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay} />

        <View
          style={[
            styles.screen,
            {
              paddingTop: insets.top > 0 ? 6 : 16,
              paddingBottom: Math.max(insets.bottom, 14),
            },
          ]}
        >
          <View style={styles.topArea}>
            <Animated.View
              style={[
                styles.heroWrap,
                {
                  width: artWidth,
                  height: artHeight,
                  opacity: fadeAnim,
                  transform: [
                    { translateY: Animated.add(riseAnim, imageFloat) },
                    { scale: imageScale },
                  ],
                },
              ]}
            >
              <Image source={current.image} resizeMode="contain" style={styles.heroImage} />
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.infoCard,
              Platform.OS === 'android' && styles.infoCardAndroid,
              {
                borderRadius: panelRadius,
                paddingHorizontal: panelPadH,
                paddingTop: panelPadTop,
                paddingBottom: panelPadBottom,
                opacity: fadeAnim,
                transform: [{ translateY: riseAnim }],
              },
            ]}
          >
            <Text
              style={[
                styles.title,
                isVerySmall && styles.titleVerySmall,
                isSmall && !isVerySmall && styles.titleSmall,
              ]}
            >
              {current.title}
            </Text>

            <Text
              style={[
                styles.description,
                isVerySmall && styles.descriptionVerySmall,
                isSmall && !isVerySmall && styles.descriptionSmall,
              ]}
            >
              {current.description}
            </Text>

            <View style={styles.dotsRow}>
              {INTRO_STEPS.map((item, index) => {
                const active = index === stepIndex;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.dot,
                      active ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                );
              })}
            </View>

            <Pressable style={styles.primaryButton} onPress={onNextPress}>
              <Text style={styles.primaryButtonText}>{current.buttonLabel}</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0A2C9F',
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 24, 92, 0.08)',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  topArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 260,
  },
  heroWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    backgroundColor: 'rgba(48, 103, 228, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(121, 169, 255, 0.25)',
    shadowColor: '#00154B',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  infoCardAndroid: {
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  titleSmall: {
    fontSize: 18,
    lineHeight: 23,
  },
  titleVerySmall: {
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 10,
  },
  description: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '400',
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  descriptionSmall: {
    fontSize: 13,
    lineHeight: 17,
    marginBottom: 12,
  },
  descriptionVerySmall: {
    fontSize: 12.5,
    lineHeight: 16,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: '#FFD400',
  },
  dotInactive: {
    backgroundColor: '#68C554',
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFC800',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '700',
  },
});