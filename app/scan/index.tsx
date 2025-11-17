import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScanScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const scanAnimation = new Animated.Value(0);

  const startScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleScan = () => {
    setIsScanning(true);
    startScanAnimation();

    // Mock scanning process
    setTimeout(() => {
      const mockItems = ['Chicken breast', 'Garlic', 'Olive oil', 'Onions'];
      setScannedItems(mockItems);
      setIsScanning(false);
      
      Alert.alert(
        'Ingredients Found! 🎉',
        `Found: ${mockItems.join(', ')}\n\nWould you like to add these to your shopping list?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Add to List', 
            onPress: () => {
              Alert.alert('Success!', 'Ingredients added to shopping list');
              router.back();
            }
          }
        ]
      );
    }, 3000);
  };

  const translateY = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0ea5e9', '#0284c7', '#0369a1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="scan" size={24} color="white" />
            <Text style={styles.headerTitle}>Scan Ingredients</Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Point camera at ingredient labels or barcodes</Text>
      </LinearGradient>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraView}>
          {/* Corner overlays */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          
          {/* Scanning line animation */}
          {isScanning && (
            <Animated.View
              style={[
                styles.scanningLine,
                { transform: [{ translateY }] }
              ]}
            />
          )}

          {/* Center guide */}
          <View style={styles.centerGuide}>
            <View style={styles.guideFrame}>
              <Ionicons name="scan-outline" size={48} color="rgba(255,255,255,0.8)" />
              <Text style={styles.guideText}>
                {isScanning ? 'Scanning...' : 'Position ingredients here'}
              </Text>
            </View>
          </View>

          {/* Status overlay */}
          {isScanning && (
            <View style={styles.scanningOverlay}>
              <LinearGradient
                colors={['transparent', 'rgba(14, 165, 233, 0.2)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.scanningGradient}
              >
                <View style={styles.scanningIndicator}>
                  <Ionicons name="flash" size={20} color="white" />
                  <Text style={styles.scanningText}>Analyzing...</Text>
                </View>
              </LinearGradient>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        {/* Quick Tips */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <Ionicons name="barcode-outline" size={16} color="#0ea5e9" />
            </View>
            <Text style={styles.tipText}>Scan barcodes</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <Ionicons name="text-outline" size={16} color="#10b981" />
            </View>
            <Text style={styles.tipText}>Read labels</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <Ionicons name="leaf-outline" size={16} color="#f59e0b" />
            </View>
            <Text style={styles.tipText}>Fresh produce</Text>
          </View>
        </View>

        {/* Scan Button */}
        <TouchableOpacity
          onPress={handleScan}
          disabled={isScanning}
          style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
        >
          <LinearGradient
            colors={isScanning ? ['#64748b', '#475569'] : ['#10b981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scanButtonGradient}
          >
            <Ionicons
              name={isScanning ? "hourglass-outline" : "camera"}
              size={24}
              color="white"
            />
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Scanning...' : 'Start Scanning'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Alternative Actions */}
        <View style={styles.alternativeActions}>
          <TouchableOpacity style={styles.altAction} onPress={() => router.push('/add-recipe')}>
            <View style={styles.altActionIcon}>
              <Ionicons name="add-circle-outline" size={20} color="#0ea5e9" />
            </View>
            <Text style={styles.altActionText}>Manual Entry</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.altAction} onPress={() => router.push('/shopping')}>
            <View style={styles.altActionIcon}>
              <Ionicons name="list-outline" size={20} color="#0ea5e9" />
            </View>
            <Text style={styles.altActionText}>Shopping List</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Scans */}
        {scannedItems.length > 0 && (
          <View style={styles.recentScans}>
            <Text style={styles.recentTitle}>Recently Scanned</Text>
            <View style={styles.recentItems}>
              {scannedItems.slice(0, 3).map((item, index) => (
                <View key={index} style={styles.recentItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.recentItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  closeButton: {
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
  helpButton: {
    padding: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    padding: 20,
  },
  cameraView: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: 'white',
    zIndex: 2,
  },
  topLeft: {
    top: 20,
    left: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 20,
    right: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  scanningLine: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#0ea5e9',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 3,
  },
  centerGuide: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideFrame: {
    alignItems: 'center',
    padding: 20,
  },
  guideText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
  },
  scanningGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanningText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  controls: {
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  tipsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  tipItem: {
    alignItems: 'center',
    flex: 1,
  },
  tipIcon: {
    backgroundColor: 'white',
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
  scanButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  scanButtonDisabled: {
    shadowColor: '#64748b',
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  alternativeActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  altAction: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  altActionIcon: {
    marginBottom: 8,
  },
  altActionText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  recentScans: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  recentItems: {
    gap: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentItemText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
});