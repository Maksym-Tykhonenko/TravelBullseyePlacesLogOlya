import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  easyTravelerQuestions,
  PassportQuizMode,
  PassportQuizQuestion,
  sharpExplorerQuestions,
} from '../data/passportChallengeData';

const BG_IMAGE = require('../assets/images/atlas_bluefield.png');
const HERO_IMAGE = require('../assets/images/trail_intro_scene_a.png');
const QUESTION_BOARD = require('../assets/images/memory_sketch_set_c.png');

type ScreenPhase = 'intro' | 'quiz' | 'finished';

export default function PassportChallengeScreen() {
  const { height, width } = useWindowDimensions();

  const isSmall = height < 760;
  const isVerySmall = height < 700;

  const [showModeModal, setShowModeModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const [selectedMode, setSelectedMode] = useState<PassportQuizMode>('easy');
  const [phase, setPhase] = useState<ScreenPhase>('intro');

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [revealedCorrectId, setRevealedCorrectId] = useState<string | null>(null);
  const [revealedWrongId, setRevealedWrongId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslate = useRef(new Animated.Value(24)).current;

  const introTitleOpacity = useRef(new Animated.Value(0)).current;
  const introTitleTranslate = useRef(new Animated.Value(14)).current;
  const introHeroOpacity = useRef(new Animated.Value(0)).current;
  const introHeroScale = useRef(new Animated.Value(0.92)).current;
  const introCardOpacity = useRef(new Animated.Value(0)).current;
  const introCardTranslate = useRef(new Animated.Value(18)).current;

  const quizHeaderOpacity = useRef(new Animated.Value(0)).current;
  const quizHeaderTranslate = useRef(new Animated.Value(14)).current;
  const boardOpacity = useRef(new Animated.Value(0)).current;
  const boardScale = useRef(new Animated.Value(0.92)).current;
  const answersOpacity = useRef(new Animated.Value(0)).current;
  const answersTranslate = useRef(new Animated.Value(20)).current;

  const heroFloat = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.92)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const questions = useMemo<PassportQuizQuestion[]>(() => {
    return selectedMode === 'easy' ? easyTravelerQuestions : sharpExplorerQuestions;
  }, [selectedMode]);

  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    screenOpacity.setValue(0);
    screenTranslate.setValue(24);

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

    if (phase === 'intro') {
      introTitleOpacity.setValue(0);
      introTitleTranslate.setValue(14);
      introHeroOpacity.setValue(0);
      introHeroScale.setValue(0.92);
      introCardOpacity.setValue(0);
      introCardTranslate.setValue(18);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(introTitleOpacity, {
            toValue: 1,
            duration: 260,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(introTitleTranslate, {
            toValue: 0,
            duration: 260,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(introHeroOpacity, {
            toValue: 1,
            duration: 280,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(introHeroScale, {
            toValue: 1,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(introCardOpacity, {
            toValue: 1,
            duration: 280,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(introCardTranslate, {
            toValue: 0,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }

    if (phase === 'quiz') {
      quizHeaderOpacity.setValue(0);
      quizHeaderTranslate.setValue(14);
      boardOpacity.setValue(0);
      boardScale.setValue(0.92);
      answersOpacity.setValue(0);
      answersTranslate.setValue(20);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(quizHeaderOpacity, {
            toValue: 1,
            duration: 240,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(quizHeaderTranslate, {
            toValue: 0,
            duration: 240,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(boardOpacity, {
            toValue: 1,
            duration: 260,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(boardScale, {
            toValue: 1,
            duration: 260,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(answersOpacity, {
            toValue: 1,
            duration: 280,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(answersTranslate, {
            toValue: 0,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [
    phase,
    questionIndex,
    screenOpacity,
    screenTranslate,
    introTitleOpacity,
    introTitleTranslate,
    introHeroOpacity,
    introHeroScale,
    introCardOpacity,
    introCardTranslate,
    quizHeaderOpacity,
    quizHeaderTranslate,
    boardOpacity,
    boardScale,
    answersOpacity,
    answersTranslate,
  ]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(heroFloat, {
          toValue: -8,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(heroFloat, {
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
  }, [heroFloat]);

  const animateModalIn = () => {
    modalScale.setValue(0.92);
    modalOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (showModeModal || showFinishModal) {
      animateModalIn();
    }
  }, [showModeModal, showFinishModal, modalOpacity, modalScale]);

  const resetQuiz = (mode: PassportQuizMode) => {
    setSelectedMode(mode);
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setRevealedCorrectId(null);
    setRevealedWrongId(null);
    setScore(0);
    setPhase('quiz');
    setShowModeModal(false);
    setShowFinishModal(false);
  };

  const openModeSelector = () => {
    setShowModeModal(true);
  };

  const handleStartWithCurrentMode = () => {
    resetQuiz(selectedMode);
  };

  const goToIntro = () => {
    setPhase('intro');
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setRevealedCorrectId(null);
    setRevealedWrongId(null);
    setScore(0);
  };

  const handleSelectOption = (optionId: string) => {
    if (selectedOptionId) {
      return;
    }

    const isCorrect = optionId === currentQuestion.correctOptionId;

    setSelectedOptionId(optionId);
    setRevealedCorrectId(currentQuestion.correctOptionId);

    if (!isCorrect) {
      setRevealedWrongId(optionId);
    } else {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      const finalScore = isCorrect ? score + 1 : score;

      if (questionIndex >= questions.length - 1) {
        setScore(finalScore);
        setPhase('finished');
        setShowFinishModal(true);
        return;
      }

      setQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setRevealedCorrectId(null);
      setRevealedWrongId(null);
      setScore(finalScore);
    }, 850);
  };

  const cardWidth = Math.min(width - 32, 360);
  const heroWidth = isVerySmall ? 200 : isSmall ? 235 : 280;
  const topGap = 20;
  const introTopSpacer = isVerySmall ? 42 : isSmall ? 52 : 64;
  const quizTopSpacer = isVerySmall ? 26 : isSmall ? 32 : 40;

  return (
    <ImageBackground source={BG_IMAGE} resizeMode="cover" style={styles.background}>
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
          {phase === 'intro' && (
            <View style={styles.introWrap}>
              <Animated.Text
                style={[
                  styles.topTitle,
                  isVerySmall && styles.topTitleSmall,
                  {
                    marginTop: topGap,
                    opacity: introTitleOpacity,
                    transform: [{ translateY: introTitleTranslate }],
                  },
                ]}
              >
                Passport Challenge
              </Animated.Text>

              <View style={{ height: introTopSpacer }} />

              <Animated.Image
                source={HERO_IMAGE}
                resizeMode="contain"
                style={[
                  styles.heroImage,
                  {
                    width: heroWidth,
                    height: heroWidth * 0.9,
                    opacity: introHeroOpacity,
                    transform: [{ translateY: heroFloat }, { scale: introHeroScale }],
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.introCard,
                  { width: cardWidth },
                  {
                    opacity: introCardOpacity,
                    transform: [{ translateY: introCardTranslate }],
                  },
                ]}
              >
                <Text style={[styles.introCardTitle, isVerySmall && styles.introCardTitleSmall]}>
                  How far does your travel knowledge go?
                </Text>

                <Text
                  style={[
                    styles.introCardText,
                    isVerySmall && styles.introCardTextSmall,
                  ]}
                >
                  Explore culture, places, traditions, and surprising facts from around the world
                </Text>

                <Pressable style={styles.primaryButton} onPress={openModeSelector}>
                  <Text style={styles.primaryButtonText}>Choose your travel pace</Text>
                </Pressable>
              </Animated.View>
            </View>
          )}

          {phase === 'quiz' && (
            <View style={styles.quizWrap}>
              <Animated.View
                style={[
                  styles.quizHeaderRow,
                  {
                    marginTop: topGap,
                    opacity: quizHeaderOpacity,
                    transform: [{ translateY: quizHeaderTranslate }],
                  },
                ]}
              >
                <Pressable style={styles.backButton} onPress={goToIntro}>
                  <Text style={styles.backButtonText}>←</Text>
                </Pressable>

                <View style={styles.quizHeaderCenter}>
                  <Text style={[styles.quizCounter, isVerySmall && styles.quizCounterSmall]}>
                    Question {questionIndex + 1} of {questions.length}
                  </Text>
                </View>

                <View style={styles.quizHeaderRightSpace} />
              </Animated.View>

              <View style={{ height: quizTopSpacer }} />

              <Animated.View
                style={[
                  styles.questionVisualWrap,
                  {
                    opacity: boardOpacity,
                    transform: [{ scale: boardScale }],
                  },
                ]}
              >
                <Image
                  source={QUESTION_BOARD}
                  resizeMode="contain"
                  style={[
                    styles.questionVisual,
                    isVerySmall && styles.questionVisualSmall,
                  ]}
                />

                <View style={[styles.questionCard, { width: cardWidth - 12 }]}>
                  <Text
                    style={[
                      styles.questionText,
                      isVerySmall && styles.questionTextSmall,
                    ]}
                  >
                    {currentQuestion.question}
                  </Text>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.answersWrap,
                  {
                    opacity: answersOpacity,
                    transform: [{ translateY: answersTranslate }],
                  },
                ]}
              >
                {currentQuestion.options.map(option => {
                  const isCorrect = revealedCorrectId === option.id;
                  const isWrong = revealedWrongId === option.id;

                  return (
                    <Pressable
                      key={option.id}
                      style={[
                        styles.answerButton,
                        isVerySmall && styles.answerButtonSmall,
                        isCorrect && styles.answerCorrect,
                        isWrong && styles.answerWrong,
                      ]}
                      onPress={() => handleSelectOption(option.id)}
                      disabled={!!selectedOptionId}
                    >
                      <View style={[styles.answerBadge, isVerySmall && styles.answerBadgeSmall]}>
                        <Text style={[styles.answerBadgeText, isVerySmall && styles.answerBadgeTextSmall]}>
                          {option.id}
                        </Text>
                      </View>

                      <Text style={[styles.answerText, isVerySmall && styles.answerTextSmall]}>
                        {option.text}
                      </Text>
                    </Pressable>
                  );
                })}
              </Animated.View>
            </View>
          )}
        </Animated.View>

        <Modal visible={showModeModal} transparent animationType="none">
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalCard,
                isVerySmall && styles.modalCardSmall,
                {
                  opacity: modalOpacity,
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalTitle, isVerySmall && styles.modalTitleSmall]}>
                  Choose your travel pace
                </Text>

                <Pressable style={styles.modalCloseButton} onPress={() => setShowModeModal(false)}>
                  <Text style={styles.modalCloseButtonText}>×</Text>
                </Pressable>
              </View>

              <View style={styles.modeButtonsRow}>
                <Pressable
                  style={[
                    styles.modePill,
                    selectedMode === 'easy' && styles.modePillActive,
                  ]}
                  onPress={() => setSelectedMode('easy')}
                >
                  <Text style={styles.modePillText}>Easy Traveler</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.modePill,
                    selectedMode === 'sharp' && styles.modePillActive,
                  ]}
                  onPress={() => setSelectedMode('sharp')}
                >
                  <Text style={styles.modePillText}>Sharp Explorer</Text>
                </Pressable>
              </View>

              <Pressable style={styles.primaryButton} onPress={handleStartWithCurrentMode}>
                <Text style={styles.primaryButtonText}>Start</Text>
              </Pressable>
            </Animated.View>
          </View>
        </Modal>

        <Modal visible={showFinishModal} transparent animationType="none">
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
              <Text style={styles.systemModalTitle}>Journey Complete</Text>

              <Text style={styles.systemModalText}>
                You have completed this quiz and uncovered new insights along the way. Score: {score}/{questions.length}
              </Text>

              <Pressable
                style={styles.systemModalSingleButton}
                onPress={() => {
                  setShowFinishModal(false);
                  goToIntro();
                }}
              >
                <Text style={styles.systemModalOkText}>Ok</Text>
              </Pressable>
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
  introWrap: {
    flex: 1,
    alignItems: 'center',
  },
  topTitle: {
    alignSelf: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 0,
  },
  topTitleSmall: {
    fontSize: 20,
  },
  heroImage: {
    marginBottom: 12,
  },
  introCard: {
    backgroundColor: '#2F66F0',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
  },
  introCardTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 10,
  },
  introCardTitleSmall: {
    fontSize: 18,
    lineHeight: 22,
  },
  introCardText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 12.5,
    lineHeight: 17,
    marginBottom: 16,
  },
  introCardTextSmall: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  primaryButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '800',
  },
  quizWrap: {
    flex: 1,
  },
  quizHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#001B73',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -1,
  },
  quizHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  quizHeaderRightSpace: {
    width: 34,
    height: 34,
  },
  quizCounter: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  quizCounterSmall: {
    fontSize: 16,
  },
  questionVisualWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questionVisual: {
    width: 250,
    height: 170,
  },
  questionVisualSmall: {
    width: 220,
    height: 150,
  },
  questionCard: {
    marginTop: -26,
    backgroundColor: '#2F66F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  questionText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  questionTextSmall: {
    fontSize: 16,
    lineHeight: 20,
  },
  answersWrap: {
    gap: 10,
  },
  answerButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#001B73',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  answerButtonSmall: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 9,
  },
  answerCorrect: {
    backgroundColor: '#149D37',
  },
  answerWrong: {
    backgroundColor: '#D7233A',
  },
  answerBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2F66F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  answerBadgeSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 10,
  },
  answerBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  answerBadgeTextSmall: {
    fontSize: 11,
  },
  answerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  answerTextSmall: {
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 14, 60, 0.50)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#2F66F0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  modalCardSmall: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
    marginRight: 12,
  },
  modalTitleSmall: {
    fontSize: 18,
    lineHeight: 22,
  },
  modalCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#001B73',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
    marginTop: -2,
  },
  modeButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  modePill: {
    flex: 1,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#5A97F4',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  modePillActive: {
    backgroundColor: '#266CFF',
  },
  modePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  systemModalCard: {
    width: 240,
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
  systemModalSingleButton: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DADADA',
    marginHorizontal: -14,
    paddingTop: 10,
    alignItems: 'center',
  },
  systemModalOkText: {
    color: '#2F66F0',
    fontSize: 12,
    fontWeight: '500',
  },
});