import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  PanResponder,
  Pressable,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { postcardPicks } from '../data/PostcardLocation';

const SKETCH_SCREEN_BG = require('../assets/images/atlas_bluefield.png');
const SKETCHES_EMPTY_STATE_IMAGE = require('../assets/images/memory_sketch_set_c.png');

const STORAGE_KEY = 'sketch_along_saved_gallery_v3';
const TUTORIAL_SEEN_KEY = 'sketch_along_tutorial_seen_v1';

type TabMode = 'draw' | 'gallery';

type DrawPoint = {
  x: number;
  y: number;
};

type StrokeShape = {
  id: string;
  color: string;
  width: number;
  points: DrawPoint[];
};

type SavedSketch = {
  id: string;
  createdAt: string;
  locationId: string;
  locationTitle: string;
  overlayOpacity: number;
  activeColor: string;
  strokes: StrokeShape[];
};

type LocationReference = {
  id: string;
  title: string;
  image: number;
};

const DRAW_COLORS = ['#119944', '#FFD400', '#FFFFFF', '#FF4B4B', '#39B8FF'];

function pointsToPath(points: DrawPoint[]) {
  if (!points.length) {
    return '';
  }

  if (points.length === 1) {
    const p = points[0];
    return `M ${p.x} ${p.y} L ${p.x + 0.1} ${p.y + 0.1}`;
  }

  return points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `L ${point.x} ${point.y}`;
    })
    .join(' ');
}

function createId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function SketchAlongScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmall = height < 760;
  const isVerySmall = height < 700;

  const references = useMemo<LocationReference[]>(() => {
    return (postcardPicks as any[])
      .filter(item => item?.id && item?.title && item?.image)
      .map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
      }));
  }, []);

  const tabBarReserve = useMemo(() => {
    if (isVerySmall) return insets.bottom + 98;
    if (isSmall) return insets.bottom + 108;
    return insets.bottom + 116;
  }, [insets.bottom, isSmall, isVerySmall]);

  const topHeaderBlock = useMemo(() => {
    if (isVerySmall) return 124;
    if (isSmall) return 132;
    return 138;
  }, [isSmall, isVerySmall]);

  const drawTopBarHeight = isVerySmall ? 40 : 44;
  const drawControlsHeight = isVerySmall ? 44 : 48;
  const drawGap = isVerySmall ? 10 : 12;

  const maxBoardWidth = useMemo(() => {
    if (isVerySmall) return Math.min(width - 32, 296);
    if (isSmall) return Math.min(width - 32, 324);
    return Math.min(width - 32, 360);
  }, [width, isSmall, isVerySmall]);

  const availableBoardHeight = useMemo(() => {
    const usable =
      height -
      insets.top -
      topHeaderBlock -
      drawTopBarHeight -
      drawControlsHeight -
      tabBarReserve -
      drawGap * 3;

    return Math.max(250, usable);
  }, [
    height,
    insets.top,
    topHeaderBlock,
    drawTopBarHeight,
    drawControlsHeight,
    tabBarReserve,
    drawGap,
  ]);

  const boardWidthFromHeight = availableBoardHeight / 1.33;
  const boardWidth = Math.max(220, Math.min(maxBoardWidth, boardWidthFromHeight));
  const boardHeight = boardWidth * 1.33;

  const sliderWidth = useMemo(() => {
    if (isVerySmall) return Math.max(120, Math.min(width - 178, 156));
    if (isSmall) return Math.max(138, Math.min(width - 174, 184));
    return Math.max(150, Math.min(width - 170, 210));
  }, [width, isSmall, isVerySmall]);

  const [tab, setTab] = useState<TabMode>('draw');
  const [referenceIndex, setReferenceIndex] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0.45);
  const [activeColor, setActiveColor] = useState(DRAW_COLORS[0]);
  const [strokes, setStrokes] = useState<StrokeShape[]>([]);
  const [currentStroke, setCurrentStroke] = useState<StrokeShape | null>(null);
  const [savedSketches, setSavedSketches] = useState<SavedSketch[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslate = useRef(new Animated.Value(24)).current;
  const drawOpacity = useRef(new Animated.Value(0)).current;
  const drawTranslate = useRef(new Animated.Value(18)).current;
  const boardOpacity = useRef(new Animated.Value(0)).current;
  const boardScale = useRef(new Animated.Value(0.94)).current;
  const galleryOpacity = useRef(new Animated.Value(0)).current;
  const galleryTranslate = useRef(new Animated.Value(18)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.92)).current;
  const paletteOpacity = useRef(new Animated.Value(0)).current;
  const paletteScale = useRef(new Animated.Value(0.92)).current;

  const sliderTrackRef = useRef<View | null>(null);
  const sliderTrackMetrics = useRef({ x: 0, width: sliderWidth });

  const activeReference = references[referenceIndex] ?? references[0];

  const loadStoredData = useCallback(async () => {
    try {
      const [rawSketches, tutorialSeen] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(TUTORIAL_SEEN_KEY),
      ]);

      if (!rawSketches) {
        setSavedSketches([]);
      } else {
        const parsed = JSON.parse(rawSketches) as SavedSketch[];
        setSavedSketches(Array.isArray(parsed) ? parsed : []);
      }

      if (!isLoaded && tutorialSeen !== '1') {
        setShowTutorialModal(true);
      }
    } catch {
      setSavedSketches([]);
    } finally {
      setIsLoaded(true);
    }
  }, [isLoaded]);

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
  }, [screenOpacity, screenTranslate]);

  useEffect(() => {
    if (tab === 'draw') {
      drawOpacity.setValue(0);
      drawTranslate.setValue(18);
      boardOpacity.setValue(0);
      boardScale.setValue(0.94);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(drawOpacity, {
            toValue: 1,
            duration: 220,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(drawTranslate, {
            toValue: 0,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(boardOpacity, {
            toValue: 1,
            duration: 240,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(boardScale, {
            toValue: 1,
            duration: 240,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      galleryOpacity.setValue(0);
      galleryTranslate.setValue(18);

      Animated.parallel([
        Animated.timing(galleryOpacity, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(galleryTranslate, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [
    tab,
    drawOpacity,
    drawTranslate,
    boardOpacity,
    boardScale,
    galleryOpacity,
    galleryTranslate,
  ]);

  useEffect(() => {
    if (showLeaveModal || showDeleteModal || showTutorialModal) {
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
  }, [showLeaveModal, showDeleteModal, showTutorialModal, modalOpacity, modalScale]);

  useEffect(() => {
    if (showColorPalette) {
      paletteOpacity.setValue(0);
      paletteScale.setValue(0.92);

      Animated.parallel([
        Animated.timing(paletteOpacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(paletteScale, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showColorPalette, paletteOpacity, paletteScale]);

  useEffect(() => {
    sliderTrackMetrics.current.width = sliderWidth;
  }, [sliderWidth]);

  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  useFocusEffect(
    useCallback(() => {
      loadStoredData();
    }, [loadStoredData]),
  );

  const persistSketches = async (nextSketches: SavedSketch[]) => {
    setSavedSketches(nextSketches);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSketches));
  };

  const hasUnsavedChanges = strokes.length > 0 || currentStroke !== null;

  const openGalleryTab = () => {
    if (hasUnsavedChanges) {
      setShowLeaveModal(true);
      return;
    }
    setTab('gallery');
  };

  const clearDrawing = () => {
    setStrokes([]);
    setCurrentStroke(null);
    setShowColorPalette(false);
  };

  const goToPreviousReference = () => {
    clearDrawing();
    setReferenceIndex(prev => {
      if (prev === 0) return references.length - 1;
      return prev - 1;
    });
  };

  const goToNextReference = () => {
    clearDrawing();
    setReferenceIndex(prev => {
      if (prev >= references.length - 1) return 0;
      return prev + 1;
    });
  };

  const undoLastStroke = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  const saveCurrentSketch = async () => {
    if (!activeReference || strokes.length === 0) {
      Alert.alert('Nothing to save', 'Create at least one line before saving.');
      return;
    }

    const newSketch: SavedSketch = {
      id: createId(),
      createdAt: new Date().toISOString(),
      locationId: activeReference.id,
      locationTitle: activeReference.title,
      overlayOpacity,
      activeColor,
      strokes,
    };

    try {
      const nextSketches = [newSketch, ...savedSketches];
      await persistSketches(nextSketches);
      clearDrawing();
      setTab('gallery');
    } catch {
      Alert.alert('Save failed', 'Please try again.');
    }
  };

  const shareSketch = async (item: SavedSketch) => {
    try {
      await Share.share({
        message: `Sketch Along\nLocation: ${item.locationTitle}\nCreated: ${new Date(
          item.createdAt,
        ).toLocaleDateString('en-GB')}`,
      });
    } catch {}
  };

  const askDeleteSketch = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };

  const deleteSketch = async () => {
    if (!pendingDeleteId) {
      setShowDeleteModal(false);
      return;
    }

    try {
      const nextSketches = savedSketches.filter(item => item.id !== pendingDeleteId);
      await persistSketches(nextSketches);
    } catch {
      Alert.alert('Delete failed', 'Please try again.');
    } finally {
      setPendingDeleteId(null);
      setShowDeleteModal(false);
    }
  };

  const closeTutorial = async () => {
    setShowTutorialModal(false);
    try {
      await AsyncStorage.setItem(TUTORIAL_SEEN_KEY, '1');
    } catch {}
  };

  const sliderThumbX = useMemo(() => {
    return overlayOpacity * sliderWidth;
  }, [overlayOpacity, sliderWidth]);

  const updateSliderMetrics = () => {
    if (!sliderTrackRef.current) return;
    sliderTrackRef.current.measureInWindow((x, _y, measuredWidth) => {
      sliderTrackMetrics.current = {
        x,
        width: measuredWidth || sliderWidth,
      };
    });
  };

  const setOpacityByGesture = (pageX: number) => {
    const local = pageX - sliderTrackMetrics.current.x;
    const clamped = Math.max(0, Math.min(sliderTrackMetrics.current.width, local));
    const value =
      sliderTrackMetrics.current.width === 0
        ? 0
        : clamped / sliderTrackMetrics.current.width;

    setOverlayOpacity(value);
  };

  const sliderResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: event => {
        updateSliderMetrics();
        setOpacityByGesture(event.nativeEvent.pageX);
      },
      onPanResponderMove: event => {
        setOpacityByGesture(event.nativeEvent.pageX);
      },
    });
  }, [sliderWidth]);

  const drawingResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => tab === 'draw',
      onMoveShouldSetPanResponder: () => tab === 'draw',
      onPanResponderGrant: event => {
        const { locationX, locationY } = event.nativeEvent;

        const newStroke: StrokeShape = {
          id: createId(),
          color: activeColor,
          width: 2.8,
          points: [{ x: locationX, y: locationY }],
        };

        setCurrentStroke(newStroke);
      },
      onPanResponderMove: event => {
        const { locationX, locationY } = event.nativeEvent;

        setCurrentStroke(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            points: [...prev.points, { x: locationX, y: locationY }],
          };
        });
      },
      onPanResponderRelease: () => {
        setCurrentStroke(prev => {
          if (!prev) return null;
          if (prev.points.length < 1) return null;

          setStrokes(existing => [...existing, prev]);
          return null;
        });
      },
      onPanResponderTerminate: () => {
        setCurrentStroke(prev => {
          if (!prev) return null;
          if (prev.points.length < 1) return null;

          setStrokes(existing => [...existing, prev]);
          return null;
        });
      },
    });
  }, [tab, activeColor]);

  const getReferenceImage = (locationId: string) => {
    return references.find(item => item.id === locationId)?.image;
  };

  const renderSavedSketch = ({ item }: { item: SavedSketch }) => {
    const sourceImage = getReferenceImage(item.locationId);

    return (
      <View style={[styles.galleryCard, isVerySmall && styles.galleryCardVerySmall]}>
        <View style={styles.galleryPreviewWrap}>
          {sourceImage ? (
            <Image source={sourceImage} resizeMode="cover" style={styles.galleryPreviewImage} />
          ) : (
            <View style={styles.galleryPreviewFallback} />
          )}

          <View style={[styles.galleryPreviewOverlay, { opacity: item.overlayOpacity }]} />

          <Svg style={StyleSheet.absoluteFill}>
            {item.strokes.map(stroke => (
              <Path
                key={stroke.id}
                d={pointsToPath(stroke.points)}
                stroke={stroke.color}
                strokeWidth={stroke.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </Svg>
        </View>

        <Text style={styles.galleryTitle} numberOfLines={1}>
          {item.locationTitle}
        </Text>

        <View style={styles.galleryButtonsRow}>
          <Pressable style={styles.shareButton} onPress={() => shareSketch(item)}>
            <Text style={styles.shareButtonText}>Share</Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={() => askDeleteSketch(item.id)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={SKETCH_SCREEN_BG} resizeMode="cover" style={styles.background}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <Animated.View
          style={[
            styles.screen,
            {
              paddingBottom: tabBarReserve,
              opacity: screenOpacity,
              transform: [{ translateY: screenTranslate }],
            },
          ]}
        >
          <Text style={[styles.title, isVerySmall && styles.titleSmall]}>Sketch Along</Text>

          <View style={styles.switcherRow}>
            <Pressable
              style={[styles.switchPill, tab === 'draw' && styles.switchPillActive]}
              onPress={() => setTab('draw')}
            >
              <Text style={styles.switchPillText}>Start Drawing</Text>
            </Pressable>

            <Pressable
              style={[styles.switchPill, tab === 'gallery' && styles.switchPillActive]}
              onPress={openGalleryTab}
            >
              <Text style={styles.switchPillText}>My Sketches</Text>
            </Pressable>
          </View>

          {tab === 'draw' && activeReference ? (
            <Animated.View
              style={[
                styles.drawWrap,
                {
                  opacity: drawOpacity,
                  transform: [{ translateY: drawTranslate }],
                },
              ]}
            >
              <View style={styles.drawTopBar}>
                <Pressable style={styles.circleAction} onPress={openGalleryTab}>
                  <Text style={styles.circleActionText}>←</Text>
                </Pressable>

                <View style={styles.referencePillsRow}>
                  <Pressable style={styles.referenceArrow} onPress={goToPreviousReference}>
                    <Text style={styles.referenceArrowText}>‹</Text>
                  </Pressable>

                  <Text
                    style={[styles.referenceLabel, isVerySmall && styles.referenceLabelSmall]}
                    numberOfLines={1}
                  >
                    {activeReference.title}
                  </Text>

                  <Pressable style={styles.referenceArrow} onPress={goToNextReference}>
                    <Text style={styles.referenceArrowText}>›</Text>
                  </Pressable>
                </View>

                <Pressable style={styles.saveButton} onPress={saveCurrentSketch}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>

              <Animated.View
                style={[
                  styles.boardOuter,
                  isVerySmall && styles.boardOuterVerySmall,
                  {
                    width: boardWidth,
                    height: boardHeight,
                    opacity: boardOpacity,
                    transform: [{ scale: boardScale }],
                  },
                ]}
              >
                <View style={styles.boardInner} {...drawingResponder.panHandlers}>
                  <Image source={activeReference.image} resizeMode="cover" style={styles.boardImage} />
                  <View style={[styles.whiteOverlay, { opacity: overlayOpacity }]} />

                  <Svg style={StyleSheet.absoluteFill}>
                    {strokes.map(stroke => (
                      <Path
                        key={stroke.id}
                        d={pointsToPath(stroke.points)}
                        stroke={stroke.color}
                        strokeWidth={stroke.width}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}

                    {currentStroke ? (
                      <Path
                        d={pointsToPath(currentStroke.points)}
                        stroke={currentStroke.color}
                        strokeWidth={currentStroke.width}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : null}
                  </Svg>
                </View>
              </Animated.View>

              <View style={[styles.drawBottomControls, isVerySmall && styles.drawBottomControlsSmall]}>
                <Pressable style={styles.circleAction} onPress={undoLastStroke}>
                  <Text style={styles.circleActionText}>↶</Text>
                </Pressable>

                <View style={styles.sliderWrap}>
                  <View
                    ref={sliderTrackRef}
                    style={styles.sliderTrack}
                    onLayout={updateSliderMetrics}
                    {...sliderResponder.panHandlers}
                  >
                    <View style={styles.sliderBase} />
                    <View style={[styles.sliderFill, { width: sliderThumbX }]} />
                    <View style={[styles.sliderThumb, { left: sliderThumbX - 11 }]} />
                  </View>
                </View>

                <View style={styles.colorSelectorWrap}>
                  {showColorPalette ? (
                    <Animated.View
                      style={[
                        styles.colorPalette,
                        isVerySmall && styles.colorPaletteSmall,
                        {
                          opacity: paletteOpacity,
                          transform: [{ scale: paletteScale }],
                        },
                      ]}
                    >
                      {DRAW_COLORS.map(color => (
                        <Pressable
                          key={color}
                          style={[
                            styles.paletteColorDot,
                            { backgroundColor: color },
                            activeColor === color && styles.paletteColorDotActive,
                          ]}
                          onPress={() => {
                            setActiveColor(color);
                            setShowColorPalette(false);
                          }}
                        />
                      ))}
                    </Animated.View>
                  ) : null}

                  <Pressable
                    style={[styles.activeColorDot, { backgroundColor: activeColor }]}
                    onPress={() => setShowColorPalette(prev => !prev)}
                  />
                </View>
              </View>
            </Animated.View>
          ) : (
            <Animated.View
              style={[
                styles.galleryWrap,
                {
                  opacity: galleryOpacity,
                  transform: [{ translateY: galleryTranslate }],
                },
              ]}
            >
              {!isLoaded ? (
                <View style={styles.loaderWrap}>
                  <Text style={styles.loaderText}>Loading...</Text>
                </View>
              ) : savedSketches.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <Image
                    source={SKETCHES_EMPTY_STATE_IMAGE}
                    resizeMode="contain"
                    style={[styles.emptyImage, isVerySmall && styles.emptyImageVerySmall]}
                  />

                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                      Create your first travel sketch and it will appear here
                    </Text>
                  </View>
                </View>
              ) : (
                <FlatList
                  data={savedSketches}
                  keyExtractor={item => item.id}
                  numColumns={2}
                  columnWrapperStyle={styles.galleryRow}
                  contentContainerStyle={[styles.galleryListContent, { paddingBottom: 12 }]}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderSavedSketch}
                />
              )}
            </Animated.View>
          )}
        </Animated.View>

        <Modal visible={showTutorialModal} transparent animationType="none">
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.tutorialModalCard,
                isVerySmall && styles.tutorialModalCardSmall,
                {
                  opacity: modalOpacity,
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              <View style={styles.tutorialHeaderRow}>
                <Text style={styles.tutorialTitle}>How it works</Text>

                <Pressable style={styles.tutorialCloseButton} onPress={closeTutorial}>
                  <Text style={styles.tutorialCloseButtonText}>×</Text>
                </Pressable>
              </View>

              <Text style={styles.tutorialText}>
                Tap and drag on the image to draw your sketch.
              </Text>

              <Text style={styles.tutorialText}>
                Use the left button to undo the last stroke.
              </Text>

              <Text style={styles.tutorialText}>
                Drag the slider to change the white overlay opacity.
              </Text>

              <Text style={styles.tutorialText}>
                Tap the color circle to switch the drawing color.
              </Text>

              <Text style={styles.tutorialText}>
                Press Save to keep your sketch in My Sketches.
              </Text>
            </Animated.View>
          </View>
        </Modal>

        <Modal visible={showLeaveModal} transparent animationType="none">
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.systemModalCard,
                {
                  opacity: modalOpacity,
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              <Text style={styles.systemModalTitle}>Leave Sketch?</Text>

              <Text style={styles.systemModalText}>
                If you leave now, your current sketch progress will be lost.
              </Text>

              <View style={styles.systemModalButtons}>
                <Pressable
                  style={styles.systemModalButton}
                  onPress={() => setShowLeaveModal(false)}
                >
                  <Text style={styles.systemModalStayText}>Stay</Text>
                </Pressable>

                <Pressable
                  style={styles.systemModalButton}
                  onPress={() => {
                    setShowLeaveModal(false);
                    clearDrawing();
                    setTab('gallery');
                  }}
                >
                  <Text style={styles.systemModalLeaveText}>Leave</Text>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </Modal>

        <Modal visible={showDeleteModal} transparent animationType="none">
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.systemModalCard,
                {
                  opacity: modalOpacity,
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              <Text style={styles.systemModalTitle}>Delete This Sketch?</Text>

              <Text style={styles.systemModalText}>
                Are you sure you want to delete this sketch? This action cannot be undone.
              </Text>

              <View style={styles.systemModalButtons}>
                <Pressable
                  style={styles.systemModalButton}
                  onPress={() => {
                    setPendingDeleteId(null);
                    setShowDeleteModal(false);
                  }}
                >
                  <Text style={styles.systemModalStayText}>Cancel</Text>
                </Pressable>

                <Pressable style={styles.systemModalButton} onPress={deleteSketch}>
                  <Text style={styles.systemModalLeaveText}>Delete</Text>
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
    marginBottom: 12,
  },
  titleSmall: {
    fontSize: 20,
  },
  switcherRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 8,
  },
  switchPill: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5A97F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchPillActive: {
    backgroundColor: '#266CFF',
  },
  switchPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  drawWrap: {
    flex: 1,
    alignItems: 'center',
  },
  drawTopBar: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  circleAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#001B73',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -2,
  },
  referencePillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  referenceArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#5A97F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  referenceArrowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -2,
  },
  referenceLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginHorizontal: 10,
    maxWidth: 170,
    textAlign: 'center',
  },
  referenceLabelSmall: {
    fontSize: 11,
    maxWidth: 132,
  },
  saveButton: {
    minWidth: 58,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  saveButtonText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '800',
  },
  boardOuter: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1E4ED8',
    padding: 10,
  },
  boardOuterVerySmall: {
    borderRadius: 16,
    padding: 8,
  },
  boardInner: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#DDE5FF',
  },
  boardImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  drawBottomControls: {
    width: '100%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 6,
  },
  drawBottomControlsSmall: {
    minHeight: 44,
    marginTop: 10,
    paddingHorizontal: 2,
  },
  sliderWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sliderTrack: {
    height: 28,
    justifyContent: 'center',
  },
  sliderBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E3E3E3',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD400',
  },
  sliderThumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    top: 3,
  },
  colorSelectorWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 34,
  },
  activeColorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D7F4D7',
  },
  colorPalette: {
    position: 'absolute',
    bottom: 40,
    right: -6,
    backgroundColor: 'rgba(6, 22, 98, 0.96)',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
  },
  colorPaletteSmall: {
    bottom: 38,
    right: -4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 7,
  },
  paletteColorDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  paletteColorDotActive: {
    borderWidth: 3,
    borderColor: '#FFD400',
  },
  galleryWrap: {
    flex: 1,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  emptyImage: {
    width: 220,
    height: 180,
    marginBottom: 18,
  },
  emptyImageVerySmall: {
    width: 190,
    height: 160,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 340,
    minHeight: 74,
    backgroundColor: '#2F66F0',
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  emptyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  galleryListContent: {
    paddingBottom: 30,
  },
  galleryRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  galleryCard: {
    width: '48%',
    backgroundColor: '#2F66F0',
    borderRadius: 14,
    padding: 8,
  },
  galleryCardVerySmall: {
    padding: 7,
  },
  galleryPreviewWrap: {
    width: '100%',
    aspectRatio: 0.78,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  galleryPreviewImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  galleryPreviewFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#DDE5FF',
  },
  galleryPreviewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  galleryTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  galleryButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shareButton: {
    flex: 1,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '800',
  },
  deleteButton: {
    flex: 1,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E33B4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 14, 60, 0.50)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  tutorialModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#2F66F0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  tutorialModalCardSmall: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
  },
  tutorialHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tutorialTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginRight: 10,
  },
  tutorialCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#001B73',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
    marginTop: -2,
  },
  tutorialText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  systemModalCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingTop: 16,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  systemModalTitle: {
    color: '#111111',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  systemModalText: {
    color: '#333333',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 12,
  },
  systemModalButtons: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DADADA',
    marginHorizontal: -14,
    paddingTop: 10,
  },
  systemModalButton: {
    flex: 1,
    alignItems: 'center',
  },
  systemModalStayText: {
    color: '#2F66F0',
    fontSize: 12,
    fontWeight: '500',
  },
  systemModalLeaveText: {
    color: '#D7233A',
    fontSize: 12,
    fontWeight: '500',
  },
});