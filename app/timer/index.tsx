import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function TimerScreen() {
  const router = useRouter();
  const [time, setTime] = useState(0);
  const [originalTime, setOriginalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));

  const showTimerCompleteModal = useCallback(() => {
    setShowCompletionModal(true);
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [modalAnimation]);

  const hideTimerCompleteModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowCompletionModal(false);
    });
  };

  const handleModalReset = () => {
    hideTimerCompleteModal();
    resetTimer();
  };

  useEffect(() => {
    let interval: any;
    if (isRunning && time > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            showTimerCompleteModal();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      pulseAnimation.setValue(1);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, pulseAnimation, showTimerCompleteModal]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    const minutes = parseInt(inputMinutes);
    if (minutes > 0) {
      const totalSeconds = minutes * 60;
      setTime(totalSeconds);
      setOriginalTime(totalSeconds);
      setIsRunning(true);
    }
  };

  const startPresetTimer = (minutes: number) => {
    const totalSeconds = minutes * 60;
    setTime(totalSeconds);
    setOriginalTime(totalSeconds);
    setIsRunning(true);
    setInputMinutes(minutes.toString());
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setOriginalTime(0);
    setInputMinutes('');
  };

  const addTime = (minutes: number) => {
    setTime(prev => prev + minutes * 60);
    if (originalTime > 0) {
      setOriginalTime(prev => prev + minutes * 60);
    }
  };

  const getProgressPercentage = () => {
    if (originalTime === 0) return 0;
    return ((originalTime - time) / originalTime) * 100;
  };

  const getTimerColor = () => {
    if (time === 0) return ['#64748b', '#475569'];
    if (time < 60) return ['#ef4444', '#dc2626'];
    if (time < 300) return ['#f59e0b', '#d97706'];
    return ['#10b981', '#059669'];
  };

  const presetTimers = [
    { label: '1 min', value: 1, icon: 'flash', color: ['#06b6d4', '#0891b2'] },
    { label: '5 min', value: 5, icon: 'timer', color: ['#10b981', '#059669'] },
    { label: '10 min', value: 10, icon: 'hourglass', color: ['#f59e0b', '#d97706'] },
    { label: '15 min', value: 15, icon: 'time', color: ['#a855f7', '#9333ea'] },
    { label: '20 min', value: 20, icon: 'stopwatch', color: ['#ef4444', '#dc2626'] },
    { label: '30 min', value: 30, icon: 'alarm', color: ['#ec4899', '#db2777'] },
  ];

  const quickAddTimes = [
    { label: '+30s', value: 0.5, icon: 'add-circle-outline' },
    { label: '+1m', value: 1, icon: 'add-circle' },
    { label: '+5m', value: 5, icon: 'add-circle' },
    { label: '+10m', value: 10, icon: 'add-circle' },
  ];

  const CustomCompletionModal = () => (
    <Modal
      visible={showCompletionModal}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: modalAnimation },
                {
                  translateY: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
              opacity: modalAnimation,
            },
          ]}
        >
          <LinearGradient
            colors={['#10b981', '#059669', '#047857']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalGradient}
          >
            {/* Celebration Animation */}
            <View style={styles.celebrationContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={64} color="white" />
              </View>
              <View style={styles.sparkleContainer}>
                <Ionicons name="sparkles" size={24} color="#fbbf24" style={styles.sparkle1} />
                <Ionicons name="sparkles" size={20} color="#fbbf24" style={styles.sparkle2} />
                <Ionicons name="sparkles" size={18} color="#fbbf24" style={styles.sparkle3} />
              </View>
            </View>

            {/* Modal Content */}
            <Text style={styles.modalTitle}>Timer Complete! 🎉</Text>
            <Text style={styles.modalSubtitle}>Your cooking timer has finished!</Text>
            <Text style={styles.modalDescription}>
              Time to check on your delicious creation
            </Text>

            {/* Action Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  hideTimerCompleteModal();
                  // Set up another timer with same duration
                  if (originalTime > 0) {
                    setTime(originalTime);
                    setIsRunning(true);
                  }
                }}
                style={styles.modalButton}
              >
                <LinearGradient
                  colors={['#0ea5e9', '#0284c7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalButtonGradient}
                >
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.modalButtonText}>Restart</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleModalReset}
                style={styles.modalButton}
              >
                <View style={styles.modalSecondaryButton}>
                  <Ionicons name="checkmark" size={20} color="#059669" />
                  <Text style={styles.modalSecondaryText}>Done</Text>
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#0ea5e9', '#0284c7', '#0369a1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Ionicons name="timer" size={28} color="white" />
              <Text style={styles.headerTitle}>Cooking Timer</Text>
            </View>
            <TouchableOpacity onPress={resetTimer} style={styles.resetButton}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Perfect timing for every dish</Text>
        </LinearGradient>

        <View style={styles.timerSection}>
          <Animated.View
            style={[
              styles.timerCircle,
              { transform: [{ scale: pulseAnimation }] }
            ]}
          >
            <LinearGradient
              colors={getTimerColor() as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.timerGradient}
            >
              {originalTime > 0 && (
                <View style={styles.progressRing}>
                  <View style={[
                    styles.progressArc,
                    {
                      transform: [{
                        rotate: `${(getProgressPercentage() * 360 / 100)}deg`
                      }]
                    }
                  ]} />
                </View>
              )}
              
              <View style={styles.timerDisplay}>
                <Text style={styles.timeText}>{formatTime(time)}</Text>
                {time > 0 && (
                  <Text style={styles.statusText}>
                    {isRunning ? 'Running' : 'Paused'}
                  </Text>
                )}
              </View>
            </LinearGradient>
          </Animated.View>

          {time > 0 && (
            <View style={styles.quickAddContainer}>
              {quickAddTimes.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => addTime(item.value)}
                  style={styles.quickAddButton}
                >
                  <Ionicons name={item.icon as any} size={16} color="#0ea5e9" />
                  <Text style={styles.quickAddText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.controlsSection}>
          {time === 0 ? (
            <View style={styles.setupContainer}>
              <Text style={styles.setupTitle}>Set Timer</Text>
              
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  onPress={() => setInputMinutes(prev => Math.max(0, parseInt(prev || '0') - 1).toString())}
                  style={styles.inputButton}
                >
                  <Ionicons name="remove" size={24} color="#0ea5e9" />
                </TouchableOpacity>
                
                <View style={styles.timeDisplay}>
                  <Text style={styles.inputMinutes}>{inputMinutes || '0'}</Text>
                  <Text style={styles.minutesLabel}>minutes</Text>
                </View>
                
                <TouchableOpacity
                  onPress={() => setInputMinutes(prev => (parseInt(prev || '0') + 1).toString())}
                  style={styles.inputButton}
                >
                  <Ionicons name="add" size={24} color="#0ea5e9" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                onPress={startTimer}
                style={styles.startButton}
                disabled={!inputMinutes || parseInt(inputMinutes) === 0}
              >
                <LinearGradient
                  colors={['#0ea5e9', '#0284c7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.startGradient}
                >
                  <Ionicons name="play" size={20} color="white" />
                  <Text style={styles.startText}>Start Timer</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.activeControlsContainer}>
              <TouchableOpacity
                onPress={isRunning ? pauseTimer : resumeTimer}
                style={styles.primaryControl}
              >
                <LinearGradient
                  colors={isRunning ? ['#f59e0b', '#d97706'] : ['#10b981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.controlGradient}
                >
                  <Ionicons name={isRunning ? "pause" : "play"} size={24} color="white" />
                  <Text style={styles.controlText}>{isRunning ? 'Pause' : 'Resume'}</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={resetTimer} style={styles.secondaryControl}>
                <View style={styles.resetButtonContent}>
                  <Ionicons name="stop" size={24} color="#ef4444" />
                  <Text style={styles.resetControlText}>Reset</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.presetsSection}>
          <Text style={styles.presetsTitle}>Quick Timers</Text>
          <View style={styles.presetsGrid}>
            {presetTimers.map((preset) => (
              <TouchableOpacity
                key={preset.label}
                onPress={() => startPresetTimer(preset.value)}
                style={styles.presetButton}
              >
                <LinearGradient
                  colors={preset.color as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.presetGradient}
                >
                  <Ionicons name={preset.icon as any} size={20} color="white" />
                  <Text style={styles.presetText}>{preset.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <CustomCompletionModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
  resetButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  timerSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  timerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 142,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  progressArc: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 142,
    borderTopWidth: 4,
    borderTopColor: 'white',
    transform: [{ rotate: '-90deg' }],
  },
  timerDisplay: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 42,
    fontWeight: '900',
    color: 'white',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  quickAddContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAddButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAddText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 4,
  },
  controlsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  setupContainer: {
    alignItems: 'center',
  },
  setupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputButton: {
    backgroundColor: '#e0f2fe',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplay: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  inputMinutes: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1e293b',
    fontFamily: 'monospace',
  },
  minutesLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  startText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  activeControlsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryControl: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  controlGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  controlText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  secondaryControl: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  resetControlText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    marginTop: 4,
  },
  presetsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  presetsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetButton: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  presetGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  presetText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  // Custom Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  modalGradient: {
    padding: 32,
    alignItems: 'center',
  },
  celebrationContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 16,
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle1: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  sparkle2: {
    position: 'absolute',
    bottom: -8,
    left: -8,
  },
  sparkle3: {
    position: 'absolute',
    top: 20,
    left: -15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 32,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  modalSecondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    borderRadius: 16,
  },
  modalSecondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  lastSection: {
    paddingBottom: 100,
  },
});