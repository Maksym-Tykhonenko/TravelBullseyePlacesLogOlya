import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_GOOGLE, Region, MapPressEvent } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { postcardPicks } from '../data/PostcardLocation';

const MARKER_RED = require('../assets/images/map/dart_marker_crimson.png');
const MARKER_YELLOW = require('../assets/images/map/dart_marker_sunflare.png');
const MARKER_GREEN = require('../assets/images/map/dart_marker_leafway.png');
const DART_CLUSTER = require('../assets/images/map/dart_cluster_trio.png');

const STORAGE_KEY = 'travel_bullseye_saved_pins_v2';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MarkerTone = 'want' | 'seen' | 'wish';
type KeyboardField = 'title' | 'note';

type SavedPin = {
  id: string;
  title: string;
  note: string;
  createdAt: string;
  tone: Exclude<MarkerTone, 'wish'>;
  latitude: number;
  longitude: number;
};

type AppSpot = {
  id: string;
  title: string;
  country: string;
  latitude: number;
  longitude: number;
  image: any;
  sourceId: string;
};

const INITIAL_REGION: Region = {
  latitude: 50.4,
  longitude: 12.8,
  latitudeDelta: 44,
  longitudeDelta: 36,
};

const APP_SPOTS: AppSpot[] = [
  {
    id: 'hallstatt-map',
    title: 'Hallstatt',
    country: 'Austria',
    latitude: 47.5613,
    longitude: 13.6493,
    image: postcardPicks.find(item => item.id === 'hallstatt-austria')?.image,
    sourceId: 'hallstatt-austria',
  },
  {
    id: 'albarracin-map',
    title: 'Albarracín',
    country: 'Spain',
    latitude: 40.408,
    longitude: -1.4445,
    image: postcardPicks.find(item => item.id === 'albarracin-spain')?.image,
    sourceId: 'albarracin-spain',
  },
  {
    id: 'chefchaouen-map',
    title: 'Chefchaouen',
    country: 'Morocco',
    latitude: 35.1688,
    longitude: -5.2636,
    image: postcardPicks.find(item => item.id === 'chefchaouen-morocco')?.image,
    sourceId: 'chefchaouen-morocco',
  },
  {
    id: 'lofoten-map',
    title: 'Lofoten Islands',
    country: 'Norway',
    latitude: 68.207,
    longitude: 13.57,
    image: postcardPicks.find(item => item.id === 'lofoten-norway')?.image,
    sourceId: 'lofoten-norway',
  },
  {
    id: 'meteora-map',
    title: 'Meteora',
    country: 'Greece',
    latitude: 39.7217,
    longitude: 21.63,
    image: postcardPicks.find(item => item.id === 'meteora-greece')?.image,
    sourceId: 'meteora-greece',
  },
  {
    id: 'fairy-pools-map',
    title: 'Fairy Pools',
    country: 'Scotland',
    latitude: 57.2527,
    longitude: -6.2724,
    image: postcardPicks.find(item => item.id === 'fairy-pools-skye')?.image,
    sourceId: 'fairy-pools-skye',
  },
];

const markerImageByTone = (tone: MarkerTone) => {
  if (tone === 'want') return MARKER_GREEN;
  if (tone === 'seen') return MARKER_RED;
  return MARKER_YELLOW;
};

const formatDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

type CompactKeyboardProps = {
  visible: boolean;
  activeField: KeyboardField;
  isVerySmall: boolean;
  onFieldChange: (field: KeyboardField) => void;
  onInsert: (value: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onDone: () => void;
};

function CompactKeyboard({
  visible,
  activeField,
  isVerySmall,
  onFieldChange,
  onInsert,
  onBackspace,
  onSpace,
  onDone,
}: CompactKeyboardProps) {
  if (!visible) return null;

  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  const renderKey = (key: string) => (
    <Pressable
      key={key}
      style={[styles.compactKey, isVerySmall && styles.compactKeyVerySmall]}
      onPress={() => onInsert(key)}
    >
      <Text style={[styles.compactKeyText, isVerySmall && styles.compactKeyTextVerySmall]}>
        {key}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.compactKeyboardWrap, isVerySmall && styles.compactKeyboardWrapVerySmall]}>
      <View style={styles.compactKeyboardTop}>
        <Pressable
          style={[
            styles.compactFieldSwitch,
            isVerySmall && styles.compactFieldSwitchVerySmall,
            activeField === 'title' && styles.compactFieldSwitchActive,
          ]}
          onPress={() => onFieldChange('title')}
        >
          <Text
            style={[
              styles.compactFieldSwitchText,
              isVerySmall && styles.compactFieldSwitchTextVerySmall,
            ]}
          >
            Title
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.compactFieldSwitch,
            isVerySmall && styles.compactFieldSwitchVerySmall,
            activeField === 'note' && styles.compactFieldSwitchActive,
          ]}
          onPress={() => onFieldChange('note')}
        >
          <Text
            style={[
              styles.compactFieldSwitchText,
              isVerySmall && styles.compactFieldSwitchTextVerySmall,
            ]}
          >
            Comment
          </Text>
        </Pressable>

        <View style={styles.compactKeyboardSpacer} />

        <Pressable
          style={[styles.compactDoneButton, isVerySmall && styles.compactDoneButtonVerySmall]}
          onPress={onDone}
        >
          <Text
            style={[
              styles.compactDoneButtonText,
              isVerySmall && styles.compactDoneButtonTextVerySmall,
            ]}
          >
            Done
          </Text>
        </Pressable>
      </View>

      <View style={[styles.compactKeyboardRows, isVerySmall && styles.compactKeyboardRowsVerySmall]}>
        <View style={styles.compactRow}>{row1.map(renderKey)}</View>
        <View style={styles.compactRow}>{row2.map(renderKey)}</View>

        <View style={styles.compactRow}>
          {row3.map(renderKey)}
          <Pressable
            style={[styles.compactActionKey, isVerySmall && styles.compactActionKeyVerySmall]}
            onPress={onBackspace}
          >
            <Text
              style={[
                styles.compactActionKeyText,
                isVerySmall && styles.compactActionKeyTextVerySmall,
              ]}
            >
              ⌫
            </Text>
          </Pressable>
        </View>

        <View style={styles.compactBottomRow}>
          <Pressable
            style={[styles.compactWideKey, isVerySmall && styles.compactWideKeyVerySmall]}
            onPress={onSpace}
          >
            <Text
              style={[
                styles.compactWideKeyText,
                isVerySmall && styles.compactWideKeyTextVerySmall,
              ]}
            >
              Space
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type MarkerPinProps = {
  tone: MarkerTone;
  isMapMarker?: boolean;
};

function MarkerPin({ tone, isMapMarker = false }: MarkerPinProps) {
  const source = markerImageByTone(tone);

  return (
    <Image
      source={source}
      resizeMode="contain"
      style={isMapMarker ? styles.mapMarkerImage : styles.markerChipImage}
    />
  );
}

export default function DartboardRoutesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmall = height < 760;
  const isVerySmall = height < 700;

  const mapRef = useRef<MapView | null>(null);
  const currentRegionRef = useRef<Region>(INITIAL_REGION);
  const titleInputRef = useRef<TextInput | null>(null);
  const noteInputRef = useRef<TextInput | null>(null);
  const androidModalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenFade = useRef(new Animated.Value(0)).current;
  const screenRise = useRef(new Animated.Value(24)).current;
  const spotCardOpacity = useRef(new Animated.Value(0)).current;
  const spotCardScale = useRef(new Animated.Value(0.92)).current;
  const modalOpacity = useRef(new Animated.Value(Platform.OS === 'android' ? 1 : 0)).current;
  const modalScale = useRef(new Animated.Value(Platform.OS === 'android' ? 1 : 0.92)).current;

  const [activeTab, setActiveTab] = useState<'map' | 'log'>('map');
  const [selectedAppSpot, setSelectedAppSpot] = useState<AppSpot | null>(null);
  const [placingMode, setPlacingMode] = useState<Exclude<MarkerTone, 'wish'> | null>(null);

  const [draftCoordinate, setDraftCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftNote, setDraftNote] = useState('');

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedPins, setSavedPins] = useState<SavedPin[]>([]);
  const [isLoadingPins, setIsLoadingPins] = useState(true);

  const [showCompactKeyboard, setShowCompactKeyboard] = useState(true);
  const [activeKeyboardField, setActiveKeyboardField] = useState<KeyboardField>('title');
  const [pendingModalOpen, setPendingModalOpen] = useState(0);

  const bottomNavigationSpace = useMemo(() => {
    if (isVerySmall) return insets.bottom + 88;
    if (isSmall) return insets.bottom + 96;
    return insets.bottom + 104;
  }, [insets.bottom, isSmall, isVerySmall]);

  const mapActionBottom = useMemo(() => {
    if (isVerySmall) return insets.bottom + 78;
    if (isSmall) return insets.bottom + 84;
    return insets.bottom + 90;
  }, [insets.bottom, isSmall, isVerySmall]);

  const placingHintBottom = useMemo(() => {
    if (isVerySmall) return insets.bottom + 138;
    if (isSmall) return insets.bottom + 144;
    return insets.bottom + 152;
  }, [insets.bottom, isSmall, isVerySmall]);

  const mapControlsTop = isVerySmall ? 12 : 14;
  const mapCardBorderRadius = isVerySmall ? 22 : 30;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(screenRise, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenFade, screenRise]);

  useEffect(() => {
    return () => {
      if (androidModalTimerRef.current) {
        clearTimeout(androidModalTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedAppSpot) return;

    spotCardOpacity.setValue(0);
    spotCardScale.setValue(0.92);

    Animated.parallel([
      Animated.timing(spotCardOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(spotCardScale, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedAppSpot, spotCardOpacity, spotCardScale]);

  useEffect(() => {
    if (!pendingModalOpen || !draftCoordinate || !placingMode) return;

    if (androidModalTimerRef.current) {
      clearTimeout(androidModalTimerRef.current);
      androidModalTimerRef.current = null;
    }

    if (Platform.OS === 'android') {
      androidModalTimerRef.current = setTimeout(() => {
        setShowSaveModal(true);
        androidModalTimerRef.current = null;
      }, 80);

      return () => {
        if (androidModalTimerRef.current) {
          clearTimeout(androidModalTimerRef.current);
          androidModalTimerRef.current = null;
        }
      };
    }

    setShowSaveModal(true);
  }, [pendingModalOpen, draftCoordinate, placingMode]);

  useEffect(() => {
    if (!showSaveModal) return;

    setShowCompactKeyboard(true);
    setActiveKeyboardField('title');

    if (Platform.OS === 'android') {
      modalOpacity.setValue(1);
      modalScale.setValue(1);
      requestAnimationFrame(() => {
        titleInputRef.current?.focus();
      });
      return;
    }

    modalOpacity.setValue(0);
    modalScale.setValue(0.92);

    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 80);

    return () => clearTimeout(timer);
  }, [showSaveModal, modalOpacity, modalScale]);

  const loadSavedPins = useCallback(async () => {
    try {
      setIsLoadingPins(true);
      const raw = await AsyncStorage.getItem(STORAGE_KEY);

      if (!raw) {
        setSavedPins([]);
        return;
      }

      const parsed = JSON.parse(raw) as SavedPin[];
      if (Array.isArray(parsed)) {
        setSavedPins(parsed);
      } else {
        setSavedPins([]);
      }
    } catch {
      setSavedPins([]);
    } finally {
      setIsLoadingPins(false);
    }
  }, []);

  useEffect(() => {
    loadSavedPins();
  }, [loadSavedPins]);

  useFocusEffect(
    useCallback(() => {
      loadSavedPins();
    }, [loadSavedPins]),
  );

  const persistSavedPins = useCallback(async (nextPins: SavedPin[]) => {
    setSavedPins(nextPins);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextPins));
  }, []);

  const onRegionChangeComplete = (region: Region) => {
    currentRegionRef.current = region;
  };

  const animateToRegion = (region: Region) => {
    currentRegionRef.current = region;
    mapRef.current?.animateToRegion(region, 260);
  };

  const zoomMap = (direction: 'in' | 'out') => {
    const current = currentRegionRef.current;
    const factor = direction === 'in' ? 0.65 : 1.45;

    animateToRegion({
      ...current,
      latitudeDelta: clamp(current.latitudeDelta * factor, 2, 80),
      longitudeDelta: clamp(current.longitudeDelta * factor, 2, 80),
    });
  };

  const centerMap = () => {
    animateToRegion(INITIAL_REGION);
  };

  const resetDraft = () => {
    setDraftCoordinate(null);
    setDraftTitle('');
    setDraftNote('');
  };

  const closeSaveModal = () => {
    if (androidModalTimerRef.current) {
      clearTimeout(androidModalTimerRef.current);
      androidModalTimerRef.current = null;
    }
    setShowCompactKeyboard(false);
    setShowSaveModal(false);
    setPendingModalOpen(0);
    resetDraft();
  };

  const enterPlacementMode = (tone: Exclude<MarkerTone, 'wish'>) => {
    setSelectedAppSpot(null);
    setPlacingMode(tone);
    setPendingModalOpen(0);
    resetDraft();
    setActiveTab('map');
  };

  const cancelPlacementMode = () => {
    if (androidModalTimerRef.current) {
      clearTimeout(androidModalTimerRef.current);
      androidModalTimerRef.current = null;
    }
    setPendingModalOpen(0);
    setPlacingMode(null);
    resetDraft();
  };

  const openAppSpotCard = (spot: AppSpot) => {
    setSelectedAppSpot(spot);
    setPlacingMode(null);
    setPendingModalOpen(0);
    resetDraft();

    animateToRegion({
      latitude: spot.latitude,
      longitude: spot.longitude,
      latitudeDelta: 16,
      longitudeDelta: 16,
    });
  };

  const handleMapPress = useCallback(
    (event: MapPressEvent) => {
      if (!placingMode) return;

      const { latitude, longitude } = event.nativeEvent.coordinate;

      setSelectedAppSpot(null);
      setDraftCoordinate({ latitude, longitude });
      setDraftTitle('');
      setDraftNote('');
      setActiveKeyboardField('title');
      setShowCompactKeyboard(true);
      setPendingModalOpen(Date.now());
    },
    [placingMode],
  );

  const savePin = async () => {
    if (!placingMode || !draftCoordinate || !draftTitle.trim()) return;

    const newPin: SavedPin = {
      id: `${Date.now()}`,
      title: draftTitle.trim(),
      note: draftNote.trim(),
      createdAt: formatDate(),
      tone: placingMode,
      latitude: draftCoordinate.latitude,
      longitude: draftCoordinate.longitude,
    };

    try {
      const nextPins = [newPin, ...savedPins];
      await persistSavedPins(nextPins);
      setShowSaveModal(false);
      setShowCompactKeyboard(false);
      setPendingModalOpen(0);
      setPlacingMode(null);
      resetDraft();
      setActiveTab('log');
    } catch {
      Alert.alert('Save failed', 'Please try again.');
    }
  };

  const deletePin = async (pinId: string) => {
    try {
      const nextPins = savedPins.filter(item => item.id !== pinId);
      await persistSavedPins(nextPins);
    } catch {
      Alert.alert('Delete failed', 'Please try again.');
    }
  };

  const renderPinLogItem = ({ item }: { item: SavedPin }) => {
    const chipStyle = item.tone === 'want' ? styles.wantChip : styles.seenChip;
    const chipText = item.tone === 'want' ? 'Want to Go' : 'Seen It';

    return (
      <View style={styles.logCard}>
        <View style={styles.logTopRow}>
          <View style={styles.logMetaWrap}>
            <Text style={styles.logTitle}>{item.title}</Text>
            <Text style={styles.logDate}>{item.createdAt}</Text>
          </View>

          <View style={[styles.logChip, chipStyle]}>
            <MarkerPin tone={item.tone} />
            <Text style={styles.logChipText}>{chipText}</Text>
          </View>
        </View>

        <Text style={styles.logNote} numberOfLines={isVerySmall ? 2 : 3}>
          {item.note || 'Pinned location saved without extra notes.'}
        </Text>

        <View style={styles.logBottomActions}>
          <Pressable
            style={styles.logSecondaryButton}
            onPress={() => {
              setActiveTab('map');
              animateToRegion({
                latitude: item.latitude,
                longitude: item.longitude,
                latitudeDelta: 10,
                longitudeDelta: 10,
              });
            }}
          >
            <Text style={styles.logSecondaryButtonText}>Show on Map</Text>
          </Pressable>

          <Pressable style={styles.logDeleteButton} onPress={() => deletePin(item.id)}>
            <Text style={styles.logDeleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const ModalContainer = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const modalContainerProps =
    Platform.OS === 'ios'
      ? {
          behavior: 'padding' as const,
          keyboardVerticalOffset: 10,
        }
      : {};

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <Animated.View
        style={[
          styles.container,
          {
            paddingBottom: bottomNavigationSpace,
            opacity: screenFade,
            transform: [{ translateY: screenRise }],
          },
        ]}
      >
        <Text style={[styles.title, isVerySmall && styles.titleSmall]}>Dartboard Routes</Text>

        <Text style={[styles.subtitle, isVerySmall && styles.subtitleSmall]}>
          Pin the places you&apos;ve explored and the ones waiting ahead
        </Text>

        <View style={styles.segmentRow}>
          <Pressable
            style={[styles.segmentButton, activeTab === 'map' && styles.segmentButtonActive]}
            onPress={() => setActiveTab('map')}
          >
            <Text style={styles.segmentText}>Map View</Text>
          </Pressable>

          <Pressable
            style={[styles.segmentButton, activeTab === 'log' && styles.segmentButtonActive]}
            onPress={() => setActiveTab('log')}
          >
            <Text style={styles.segmentText}>Pin Log</Text>
          </Pressable>
        </View>

        {activeTab === 'map' ? (
          <View
            style={[
              styles.mapCard,
              {
                flex: 1,
                borderRadius: mapCardBorderRadius,
              },
            ]}
          >
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={INITIAL_REGION}
              onPress={handleMapPress}
              onRegionChangeComplete={onRegionChangeComplete}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              showsCompass={false}
              rotateEnabled
              zoomEnabled
              scrollEnabled
              pitchEnabled={false}
              toolbarEnabled={false}
              showsScale={false}
              moveOnMarkerPress={false}
            >
              {APP_SPOTS.map(spot => (
                <Marker
                  key={spot.id}
                  coordinate={{
                    latitude: spot.latitude,
                    longitude: spot.longitude,
                  }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  tracksViewChanges={false}
                  onPress={() => openAppSpotCard(spot)}
                >
                  <MarkerPin tone="wish" isMapMarker />
                </Marker>
              ))}

              {savedPins.map(pin => (
                <Marker
                  key={pin.id}
                  coordinate={{
                    latitude: pin.latitude,
                    longitude: pin.longitude,
                  }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  tracksViewChanges={false}
                >
                  <MarkerPin tone={pin.tone} isMapMarker />
                </Marker>
              ))}

              {draftCoordinate && placingMode ? (
                <Marker coordinate={draftCoordinate} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
                  <MarkerPin tone={placingMode} isMapMarker />
                </Marker>
              ) : null}
            </MapView>

            <View style={[styles.mapControls, { top: mapControlsTop }]}>
              <Pressable style={styles.controlButton} onPress={() => zoomMap('in')}>
                <Text style={styles.controlText}>+</Text>
              </Pressable>

              <Pressable style={styles.controlButton} onPress={() => zoomMap('out')}>
                <Text style={styles.controlText}>−</Text>
              </Pressable>

              <Pressable style={styles.controlButton} onPress={centerMap}>
                <Text style={styles.controlText}>◎</Text>
              </Pressable>
            </View>

            {selectedAppSpot ? (
              <Animated.View
                style={[
                  styles.centerCard,
                  isVerySmall && styles.centerCardVerySmall,
                  {
                    opacity: spotCardOpacity,
                    transform: [{ scale: spotCardScale }],
                  },
                ]}
              >
                <Pressable style={styles.centerCardClose} onPress={() => setSelectedAppSpot(null)}>
                  <Text style={styles.centerCardCloseText}>×</Text>
                </Pressable>

                {selectedAppSpot.image ? (
                  <Image source={selectedAppSpot.image} style={styles.centerCardImage} />
                ) : null}

                <Text style={styles.centerCardTitle}>
                  {selectedAppSpot.title}, {selectedAppSpot.country}
                </Text>

                <Pressable
                  style={styles.exploreButton}
                  onPress={() =>
                    navigation.navigate('PostcardDetail', {
                      itemId: selectedAppSpot.sourceId,
                    })
                  }
                >
                  <Text style={styles.exploreButtonText}>Explore</Text>
                </Pressable>
              </Animated.View>
            ) : null}

            {placingMode ? (
              <>
                <View style={styles.placingBadgeWrap}>
                  <View
                    style={[
                      styles.placingBadge,
                      placingMode === 'want' ? styles.wantChip : styles.seenChip,
                    ]}
                  >
                    <MarkerPin tone={placingMode} />
                    <Text style={styles.placingBadgeText}>
                      {placingMode === 'want' ? 'Want to Go' : 'Seen It'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.placingHintWrap, { bottom: placingHintBottom }]}>
                  <Text style={styles.placingHintText}>Tap the map to place your marker</Text>
                </View>

                <View style={[styles.placingBottomRow, { bottom: mapActionBottom }]}>
                  <Pressable style={styles.closePlacementButton} onPress={cancelPlacementMode}>
                    <Text style={styles.closePlacementText}>×</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={[styles.mapActionRow, { bottom: mapActionBottom }]}>
                <Pressable
                  style={[styles.bottomToneButton, styles.wantChip]}
                  onPress={() => enterPlacementMode('want')}
                >
                  <MarkerPin tone="want" />
                  <Text style={styles.bottomToneText}>Want to Go</Text>
                </Pressable>

                <Pressable
                  style={[styles.bottomToneButton, styles.seenChip]}
                  onPress={() => enterPlacementMode('seen')}
                >
                  <MarkerPin tone="seen" />
                  <Text style={styles.bottomToneText}>Seen It</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : isLoadingPins ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        ) : savedPins.length > 0 ? (
          <View style={styles.logWrap}>
            <FlatList
              data={savedPins}
              keyExtractor={item => item.id}
              renderItem={renderPinLogItem}
              contentContainerStyle={[styles.logContent, { paddingBottom: 12 }]}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.emptyWrap}>
            <Image source={DART_CLUSTER} style={styles.emptyImage} resizeMode="contain" />
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Every place you marked stays here</Text>
            </View>
          </View>
        )}
      </Animated.View>

      <Modal
        visible={showSaveModal}
        transparent
        animationType={Platform.OS === 'android' ? 'fade' : 'none'}
        hardwareAccelerated
        statusBarTranslucent
        onRequestClose={closeSaveModal}
      >
        <ModalContainer style={styles.modalRoot} {...modalContainerProps}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalCard,
                isVerySmall && styles.modalCardVerySmall,
                isSmall && !isVerySmall && styles.modalCardSmall,
                {
                  opacity: modalOpacity,
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              <View style={styles.modalTopRow}>
                <View
                  style={[
                    styles.modalToneBadge,
                    placingMode === 'want' ? styles.wantChip : styles.seenChip,
                  ]}
                >
                  <MarkerPin tone={placingMode ?? 'want'} />
                  <Text style={styles.modalToneText}>
                    {placingMode === 'want' ? 'Want to Go' : 'Seen It'}
                  </Text>
                </View>

                <Pressable style={styles.modalClose} onPress={closeSaveModal}>
                  <Text style={styles.modalCloseText}>×</Text>
                </Pressable>
              </View>

              <TextInput
                ref={titleInputRef}
                value={draftTitle}
                onChangeText={setDraftTitle}
                placeholder="City, Location"
                placeholderTextColor="rgba(255,255,255,0.60)"
                style={[styles.modalTitleInput, isVerySmall && styles.modalTitleInputVerySmall]}
                showSoftInputOnFocus={false}
                onFocus={() => {
                  setActiveKeyboardField('title');
                  setShowCompactKeyboard(true);
                }}
              />

              <TextInput
                ref={noteInputRef}
                value={draftNote}
                onChangeText={setDraftNote}
                placeholder="Write a memory, a plan, or something special about this place"
                placeholderTextColor="rgba(255,255,255,0.48)"
                multiline
                textAlignVertical="top"
                style={[styles.modalNoteInput, isVerySmall && styles.modalNoteInputVerySmall]}
                showSoftInputOnFocus={false}
                onFocus={() => {
                  setActiveKeyboardField('note');
                  setShowCompactKeyboard(true);
                }}
              />

              <View
                style={[
                  styles.modalKeyboardHelper,
                  isVerySmall && styles.modalKeyboardHelperVerySmall,
                ]}
              >
                <Text style={styles.modalKeyboardHelperText}>
                  Your note will be saved with this marker
                </Text>
              </View>

              <Pressable
                style={[
                  styles.modalSaveButton,
                  isVerySmall && styles.modalSaveButtonVerySmall,
                  !draftTitle.trim() && styles.modalSaveButtonDisabled,
                ]}
                onPress={savePin}
                disabled={!draftTitle.trim()}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </Pressable>

              <CompactKeyboard
                visible={showCompactKeyboard}
                activeField={activeKeyboardField}
                isVerySmall={isVerySmall}
                onFieldChange={field => {
                  setActiveKeyboardField(field);

                  if (field === 'title') {
                    titleInputRef.current?.focus();
                  } else {
                    noteInputRef.current?.focus();
                  }
                }}
                onInsert={value => {
                  if (activeKeyboardField === 'title') {
                    setDraftTitle(prev => prev + value);
                  } else {
                    setDraftNote(prev => prev + value);
                  }
                }}
                onBackspace={() => {
                  if (activeKeyboardField === 'title') {
                    setDraftTitle(prev => prev.slice(0, -1));
                  } else {
                    setDraftNote(prev => prev.slice(0, -1));
                  }
                }}
                onSpace={() => {
                  if (activeKeyboardField === 'title') {
                    setDraftTitle(prev => prev + ' ');
                  } else {
                    setDraftNote(prev => prev + ' ');
                  }
                }}
                onDone={() => {
                  setShowCompactKeyboard(false);
                }}
              />
            </Animated.View>
          </View>
        </ModalContainer>
      </Modal>
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
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
  },
  titleSmall: {
    fontSize: 20,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 14,
    maxWidth: '92%',
  },
  subtitleSmall: {
    fontSize: 13,
    lineHeight: 17,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  segmentButton: {
    flex: 1,
    height: 42,
    borderRadius: 22,
    backgroundColor: '#5A97F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#266CFF',
  },
  segmentText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  mapCard: {
    overflow: 'hidden',
    backgroundColor: '#65D8F2',
    minHeight: 280,
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    right: 14,
    gap: 10,
  },
  controlButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 24, 115, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 22,
  },
  centerCard: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
    width: 176,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(17, 22, 42, 0.94)',
    paddingBottom: 14,
  },
  centerCardVerySmall: {
    width: 164,
    top: '27%',
  },
  centerCardClose: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 3,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.34)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCardCloseText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -1,
  },
  centerCardImage: {
    width: '100%',
    height: 100,
  },
  centerCardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },
  exploreButton: {
    alignSelf: 'center',
    minWidth: 112,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  exploreButtonText: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '800',
  },
  mapActionRow: {
    position: 'absolute',
    left: 18,
    right: 18,
    flexDirection: 'row',
    gap: 10,
  },
  bottomToneButton: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomToneText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  wantChip: {
    backgroundColor: '#0A9332',
  },
  seenChip: {
    backgroundColor: '#C71E72',
  },
  placingBadgeWrap: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  placingBadge: {
    minWidth: 170,
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  placingBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  placingHintWrap: {
    position: 'absolute',
    left: 18,
    right: 18,
    alignItems: 'center',
  },
  placingHintText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    backgroundColor: 'rgba(0, 24, 115, 0.72)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    textAlign: 'center',
  },
  placingBottomRow: {
    position: 'absolute',
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closePlacementButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#001F7A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePlacementText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: -2,
  },
  logWrap: {
    flex: 1,
    marginTop: 2,
  },
  logContent: {
    paddingBottom: 20,
  },
  logCard: {
    backgroundColor: '#2F66F0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  logTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logMetaWrap: {
    flex: 1,
  },
  logTitle: {
    color: '#FFD400',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  logDate: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  logChip: {
    minWidth: 146,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logChipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  logNote: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 12,
  },
  logBottomActions: {
    flexDirection: 'row',
    gap: 10,
  },
  logSecondaryButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#001B73',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logSecondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  logDeleteButton: {
    width: 90,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F05A17',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logDeleteButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emptyImage: {
    width: 230,
    height: 230,
    marginBottom: 18,
  },
  emptyCard: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: '#2F66F0',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalRoot: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 10, 44, 0.62)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    borderRadius: 26,
    backgroundColor: '#2F66F0',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },
  modalCardSmall: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
  },
  modalCardVerySmall: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
    borderRadius: 22,
  },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalToneBadge: {
    minWidth: 170,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  modalToneText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalClose: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#001F7A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
    marginTop: -2,
  },
  modalTitleInput: {
    height: 60,
    borderRadius: 22,
    backgroundColor: '#001B73',
    color: '#FFFFFF',
    fontSize: 17,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  modalTitleInputVerySmall: {
    height: 54,
    fontSize: 15,
    borderRadius: 18,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  modalNoteInput: {
    minHeight: 120,
    borderRadius: 18,
    backgroundColor: '#001B73',
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 12,
  },
  modalNoteInputVerySmall: {
    minHeight: 92,
    fontSize: 14,
    lineHeight: 18,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 10,
  },
  modalKeyboardHelper: {
    minHeight: 40,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 27, 115, 0.72)',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  modalKeyboardHelperVerySmall: {
    minHeight: 34,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  modalKeyboardHelperText: {
    color: '#DCE7FF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalSaveButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSaveButtonVerySmall: {
    height: 50,
    borderRadius: 24,
  },
  modalSaveButtonDisabled: {
    opacity: 0.55,
  },
  modalSaveButtonText: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '800',
  },
  compactKeyboardWrap: {
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: '#0D1E70',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
  },
  compactKeyboardWrapVerySmall: {
    marginTop: 10,
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 10,
  },
  compactKeyboardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  compactFieldSwitch: {
    minWidth: 64,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2342B7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 8,
  },
  compactFieldSwitchVerySmall: {
    minWidth: 56,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 8,
    marginRight: 6,
  },
  compactFieldSwitchActive: {
    backgroundColor: '#3F68FF',
  },
  compactFieldSwitchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  compactFieldSwitchTextVerySmall: {
    fontSize: 11,
  },
  compactKeyboardSpacer: {
    flex: 1,
  },
  compactDoneButton: {
    minWidth: 70,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  compactDoneButtonVerySmall: {
    minWidth: 60,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
  },
  compactDoneButtonText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '800',
  },
  compactDoneButtonTextVerySmall: {
    fontSize: 11,
  },
  compactKeyboardRows: {
    gap: 8,
  },
  compactKeyboardRowsVerySmall: {
    gap: 6,
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },
  compactKey: {
    width: 28,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#244ACD',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  compactKeyVerySmall: {
    width: 24,
    height: 30,
    borderRadius: 8,
    marginHorizontal: 1.5,
  },
  compactKeyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  compactKeyTextVerySmall: {
    fontSize: 11,
  },
  compactActionKey: {
    minWidth: 42,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#18379E',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    paddingHorizontal: 8,
  },
  compactActionKeyVerySmall: {
    minWidth: 36,
    height: 30,
    borderRadius: 8,
    marginHorizontal: 1.5,
    paddingHorizontal: 6,
  },
  compactActionKeyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  compactActionKeyTextVerySmall: {
    fontSize: 12,
  },
  compactBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  compactWideKey: {
    width: 180,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#18379E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactWideKeyVerySmall: {
    width: 150,
    height: 32,
    borderRadius: 10,
  },
  compactWideKeyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  compactWideKeyTextVerySmall: {
    fontSize: 11,
  },
  mapMarkerImage: {
    width: 40,
    height: 40,
  },
  markerChipImage: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
});