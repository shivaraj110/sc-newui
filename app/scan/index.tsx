import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from '../components/AlertProvider';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { analyzeImage, DetectedIngredient } from '../services/visionApi';

export default function ScanScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<DetectedIngredient[]>([]);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<CameraType>('back');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<any>(null);

  // Rotate tips every 4 seconds
  const tips = [
    { icon: 'barcode-outline', text: 'Scan barcodes', color: '#0ea5e9' },
    { icon: 'text-outline', text: 'Read labels', color: '#10b981' },
    { icon: 'leaf-outline', text: 'Fresh produce', color: '#f59e0b' },
    { icon: 'camera-outline', text: 'Clear photos', color: '#8b5cf6' },
    { icon: 'sunny-outline', text: 'Good lighting', color: '#f97316' },
    { icon: 'resize-outline', text: 'Fill frame', color: '#ec4899' }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const pickImageFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please grant access to your photo library to select images.',
          [{ text: 'OK' }],
          { type: 'warning' }
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setScannedItems([]);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to select image from gallery. Please try again.',
        [{ text: 'OK' }],
        { type: 'error' }
      );
    }
  };

  const handleScan = async () => {
    if (!permission?.granted) {
      requestPermission();
      return;
    }

    setIsScanning(true);
    startScanAnimation();

    try {
      let imageUri: string;

      if (selectedImage) {
        imageUri = selectedImage;
      } else {
        if (!cameraRef.current) {
          throw new Error('Camera is not ready');
        }

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        if (!photo || !photo.uri) {
          throw new Error('Failed to capture photo');
        }

        imageUri = photo.uri;
      }

      const result = await analyzeImage(imageUri);

      if (!result.ingredients || result.ingredients.length === 0) {
        setIsScanning(false);
        Alert.alert(
          'No Ingredients Found 📷',
          'Could not detect any ingredients in the image. Try:\n• Better lighting\n• Clearer view of ingredients\n• Moving closer to labels',
          [
            { text: 'Try Again', onPress: () => setSelectedImage(null) },
            { text: 'Manual Entry', onPress: () => router.push('/inventory') },
          ],
          { type: 'warning' }
        );
        return;
      }

      setScannedItems(result.ingredients);
      setIsScanning(false);

      const avgConfidence = Math.round(
        result.ingredients.reduce((sum, item) => sum + item.confidence, 0) / result.ingredients.length
      );

      Alert.alert(
        `Scan Success! 🎉`,
        `Detected ${result.ingredients.length} ingredients (${avgConfidence}% confidence):\n\n${result.ingredients.map(item => 
          `• ${item.name} (${item.confidence}%)`
        ).join('\n')}\n\nWould you like to add these to your inventory?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Add to Inventory', 
            onPress: () => {
              router.push({
                pathname: '/inventory/bulk-add',
                params: { ingredients: JSON.stringify(result.ingredients) }
              } as any);
            }
          }
        ],
        { type: 'success' }
      );
    } catch (error: any) {
      setIsScanning(false);
      console.error('Scan error:', error);
      
      Alert.alert(
        'Scan Error',
        error.message || 'Failed to scan image. Please try again.',
        [
          { text: 'Try Again', onPress: () => setSelectedImage(null) },
          { text: 'Manual Entry', onPress: () => router.push('/inventory') },
        ],
        { type: 'error' }
      );
    }
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
        {selectedImage ? (
          <View style={styles.cameraView}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            
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
                  {isScanning ? 'Scanning...' : 'Ready to scan image'}
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
                    <Text style={styles.scanningText}>
                      {Math.random() > 0.7 ? 'Processing image...' : 
                       Math.random() > 0.4 ? 'Detecting ingredients...' : 'Analyzing photo...'}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            )}
          </View>
        ) : permission === null ? (
          <View style={styles.cameraView}>
            <View style={styles.centerGuide}>
              <View style={styles.guideFrame}>
                <Ionicons name="camera-outline" size={48} color="rgba(255,255,255,0.8)" />
                <Text style={styles.guideText}>Requesting camera permission...</Text>
              </View>
            </View>
          </View>
        ) : !permission.granted ? (
          <View style={styles.cameraView}>
            <View style={styles.centerGuide}>
              <View style={styles.guideFrame}>
                <Ionicons name="camera-outline" size={48} color="rgba(255,255,255,0.8)" />
                <Text style={styles.guideText}>Camera access required</Text>
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={requestPermission}
                >
                  <Text style={styles.scanButtonText}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <CameraView style={styles.cameraView} facing={facing} ref={cameraRef}>
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
                    <Text style={styles.scanningText}>
                      {Math.random() > 0.7 ? 'Processing labels...' : 
                       Math.random() > 0.4 ? 'Detecting barcodes...' : 'Analyzing image...'}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            )}
          </CameraView>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        {/* Quick Tips */}
        <View style={styles.tipsContainer}>
          {tips.slice(currentTipIndex, currentTipIndex + 3).concat(
            currentTipIndex > tips.length - 3 ? tips.slice(0, (currentTipIndex + 3) - tips.length) : []
          ).map((tip, index) => (
            <View key={`${currentTipIndex}-${index}`} style={styles.tipItem}>
              <View style={[styles.tipIcon, { backgroundColor: 'white' }]}>
                <Ionicons name={tip.icon as any} size={16} color={tip.color} />
              </View>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
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
          <TouchableOpacity style={styles.altAction} onPress={() => router.push('/inventory')}>
            <View style={styles.altActionIcon}>
              <Ionicons name="add-circle-outline" size={20} color="#0ea5e9" />
            </View>
            <Text style={styles.altActionText}>Manual Entry</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.altAction} onPress={pickImageFromGallery}>
            <View style={styles.altActionIcon}>
              <Ionicons name="images-outline" size={20} color="#0ea5e9" />
            </View>
            <Text style={styles.altActionText}>Gallery</Text>
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
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recently Scanned</Text>
              <Text style={styles.recentSubtitle}>
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
            </View>
            <View style={styles.recentItems}>
              {scannedItems.slice(0, 3).map((item, index) => (
                <View key={index} style={styles.recentItem}>
                  <View style={styles.recentItemIcon}>
                    <Ionicons 
                      name={index === 0 ? "checkmark-circle" : index === 1 ? "star" : "bookmark"} 
                      size={16} 
                      color={index === 0 ? "#10b981" : index === 1 ? "#f59e0b" : "#8b5cf6"} 
                    />
                  </View>
                  <Text style={styles.recentItemText}>{item.name}</Text>
                  <Text style={styles.recentItemBadge}>
                    {item.confidence}%
                  </Text>
                </View>
              ))}
              {scannedItems.length > 3 && (
                <Text style={styles.moreItemsText}>
                  +{scannedItems.length - 3} more items detected
                </Text>
              )}
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
    gap: 8,
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
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  recentSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  recentItems: {
    gap: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentItemIcon: {
    marginRight: 8,
  },
  recentItemText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  recentItemBadge: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '600',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  moreItemsText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  selectedImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
});