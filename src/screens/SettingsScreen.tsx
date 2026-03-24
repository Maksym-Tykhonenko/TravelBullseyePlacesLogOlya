import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const SETTINGS_BG = require('../assets/images/atlas_bluefield.png');

const SKETCH_STORAGE_KEY = 'sketch_along_saved_gallery_v3';
const SKETCH_TUTORIAL_KEY = 'sketch_along_tutorial_seen_v1';
const SETTINGS_NOTIFICATIONS_KEY = 'settings_notifications_enabled_v1';
const DARTBOARD_PINS_STORAGE_KEY = 'travel_bullseye_saved_pins_v2';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslate = useRef(new Animated.Value(24)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(20)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslate, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 380,
        delay: 80,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslate, {
        toValue: 0,
        duration: 380,
        delay: 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenOpacity, screenTranslate, cardOpacity, cardTranslate]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(SETTINGS_NOTIFICATIONS_KEY);

        if (savedValue === '0') {
          setNotificationsEnabled(false);
        } else {
          setNotificationsEnabled(true);
        }
      } catch {
        setNotificationsEnabled(true);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (showResetModal) {
      modalOpacity.setValue(0);
      modalScale.setValue(0.92);

      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(modalScale, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showResetModal, modalOpacity, modalScale]);

  const toggleNotifications = async () => {
    const nextValue = !notificationsEnabled;
    setNotificationsEnabled(nextValue);

    try {
      await AsyncStorage.setItem(
        SETTINGS_NOTIFICATIONS_KEY,
        nextValue ? '1' : '0',
      );
    } catch {}
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message:
          'Take a look at this travel app with postcard places, routes, sketch practice, and quiz screens.',
      });
    } catch {}
  };

  const resetAllData = async () => {
    try {
      await AsyncStorage.multiRemove([
        SKETCH_STORAGE_KEY,
        SKETCH_TUTORIAL_KEY,
        DARTBOARD_PINS_STORAGE_KEY,
      ]);
    } catch {}

    setShowResetModal(false);
  };

  return (
    <ImageBackground source={SETTINGS_BG} resizeMode="cover" style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.screen,
            {
              opacity: screenOpacity,
              transform: [{ translateY: screenTranslate }],
            },
          ]}
        >
          <Text style={styles.title}>Settings</Text>

          <Animated.View
            style={{
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslate }],
            }}
          >
            <View style={styles.card}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>🔔</Text>
              </View>

              <Text style={styles.cardTitle}>Notifications</Text>

              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#8FA4E8', true: '#5A97F4' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#8FA4E8"
              />
            </View>

            <Pressable style={styles.card} onPress={shareApp}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>📤</Text>
              </View>

              <Text style={styles.cardTitle}>Share the App</Text>

              <View style={styles.trailingCircle}>
                <Text style={styles.trailingText}>›</Text>
              </View>
            </Pressable>

            <Pressable style={styles.card} onPress={() => setShowResetModal(true)}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>🔄</Text>
              </View>

              <Text style={styles.cardTitle}>Reset All Data</Text>

              <View style={styles.trailingCircle}>
                <Text style={styles.trailingText}>›</Text>
              </View>
            </Pressable>
          </Animated.View>
        </Animated.View>

        <Modal visible={showResetModal} transparent animationType="none">
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalCard,
                {
                  opacity: modalOpacity,
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              <Text style={styles.modalTitle}>Clear Everything?</Text>

              <Text style={styles.modalText}>
                This will remove your saved sketches and your added map markers. Once removed, they cannot be restored.
              </Text>

              <View style={styles.modalButtonsRow}>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => setShowResetModal(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[styles.modalButton, styles.modalButtonBorder]}
                  onPress={resetAllData}
                >
                  <Text style={styles.resetText}>Reset</Text>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0A35C8',
  },
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 20,
  },
  card: {
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: '#001B73',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2F66F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
  },
  cardTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  trailingCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2F66F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  trailingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 14, 60, 0.50)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingTop: 16,
    paddingHorizontal: 14,
    paddingBottom: 0,
    overflow: 'hidden',
  },
  modalTitle: {
    color: '#111111',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalText: {
    color: '#333333',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 14,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DADADA',
  },
  modalButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#DADADA',
  },
  cancelText: {
    color: '#2F66F0',
    fontSize: 12,
    fontWeight: '500',
  },
  resetText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
  },
});