import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from '../components/AlertProvider';
import { InventoryItem, inventoryCategories } from '../data/inventory';
import { InventoryStorage } from '../services/inventoryStorage';

interface ScannedIngredient {
  name: string;
  confidence: number;
}

const units = ['pieces', 'kg', 'g', 'L', 'ml', 'cups', 'tbsp', 'tsp', 'lbs', 'oz', 'dozen', 'bunches', 'cans'];

export default function BulkAddScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [scannedIngredients, setScannedIngredients] = useState<ScannedIngredient[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addedItems, setAddedItems] = useState<InventoryItem[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    unit: 'pieces',
    category: 'Pantry',
    expirationDate: '',
    notes: ''
  });

  useEffect(() => {
    if (params.ingredients) {
      try {
        const ingredients = JSON.parse(params.ingredients as string);
        setScannedIngredients(ingredients);
        if (ingredients.length > 0) {
          setFormData(prev => ({
            ...prev,
            name: ingredients[0].name
          }));
        }
      } catch (error) {
        console.error('Failed to parse ingredients:', error);
        router.back();
      }
    } else {
      router.back();
    }
  }, [params.ingredients]);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Fruits': 'leaf',
      'Vegetables': 'nutrition',
      'Dairy': 'water',
      'Meat': 'restaurant',
      'Seafood': 'fish',
      'Bakery': 'cafe',
      'Pantry': 'archive',
      'Spices': 'flower',
      'Frozen': 'snow',
      'Beverages': 'wine',
      'Snacks': 'fast-food',
      'Condiments': 'beaker'
    };
    return icons[category] || 'basket';
  };

  const handleSaveItem = async () => {
    if (!formData.amount.trim()) {
      Alert.error('Missing Information', 'Please enter the amount.');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.error('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    const newItem: InventoryItem = {
      id: `${Date.now()}-${currentIndex}`,
      name: formData.name.trim(),
      amount: amount,
      unit: formData.unit,
      category: formData.category,
      expirationDate: formData.expirationDate || undefined,
      dateAdded: new Date().toISOString().split('T')[0],
      notes: formData.notes || undefined
    };
    
    setAddedItems(prev => [...prev, newItem]);

    if (currentIndex < scannedIngredients.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setFormData({
        name: scannedIngredients[nextIndex].name,
        amount: '',
        unit: 'pieces',
        category: 'Pantry',
        expirationDate: '',
        notes: ''
      });
    } else {
      await finishAdding([...addedItems, newItem]);
    }
  };

  const finishAdding = async (items: InventoryItem[]) => {
    try {
      await InventoryStorage.addItems(items);
      Alert.success('Complete!', `Added ${items.length} ingredient${items.length > 1 ? 's' : ''} to inventory`);
      router.back();
    } catch (error) {
      console.error('Failed to save items:', error);
      Alert.error('Error', 'Failed to save items. Please try again.');
    }
  };

  const handleSkip = async () => {
    if (currentIndex < scannedIngredients.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setFormData({
        name: scannedIngredients[nextIndex].name,
        amount: '',
        unit: 'pieces',
        category: 'Pantry',
        expirationDate: '',
        notes: ''
      });
    } else {
      if (addedItems.length > 0) {
        await finishAdding(addedItems);
      } else {
        router.back();
      }
    }
  };

  const handleRemove = async () => {
    const updatedIngredients = scannedIngredients.filter((_, idx) => idx !== currentIndex);
    
    if (updatedIngredients.length === 0) {
      if (addedItems.length > 0) {
        await finishAdding(addedItems);
      } else {
        router.back();
      }
      return;
    }

    setScannedIngredients(updatedIngredients);
    
    if (currentIndex >= updatedIngredients.length) {
      const newIndex = updatedIngredients.length - 1;
      setCurrentIndex(newIndex);
      setFormData({
        name: updatedIngredients[newIndex].name,
        amount: '',
        unit: 'pieces',
        category: 'Pantry',
        expirationDate: '',
        notes: ''
      });
    } else {
      setFormData({
        name: updatedIngredients[currentIndex].name,
        amount: '',
        unit: 'pieces',
        category: 'Pantry',
        expirationDate: '',
        notes: ''
      });
    }
  };

  const currentIngredient = scannedIngredients[currentIndex];

  if (!currentIngredient) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={['#10b981', '#059669', '#047857']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Ionicons name="scan" size={24} color="white" />
              <Text style={styles.headerTitle}>Add Scanned Items</Text>
            </View>
            <View style={styles.placeholderButton} />
          </View>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Item {currentIndex + 1} of {scannedIngredients.length}
            </Text>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#ffffff', '#f0fdf4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  { width: `${((currentIndex + 1) / scannedIngredients.length) * 100}%` }
                ]}
              />
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Current Item Card */}
          <View style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.itemNameContainer}>
                <Ionicons name="leaf" size={20} color="#10b981" />
                <Text style={styles.itemName}>{formData.name}</Text>
              </View>
              <View style={styles.confidenceBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                <Text style={styles.confidenceText}>{currentIngredient.confidence}%</Text>
              </View>
            </View>
            
            {/* Amount & Unit */}
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Amount *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1.0"
                  keyboardType="numeric"
                  value={formData.amount}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                  autoFocus
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Unit *</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.unitScroll}
                  contentContainerStyle={styles.unitScrollContent}
                >
                  {units.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      onPress={() => setFormData(prev => ({ ...prev, unit }))}
                      style={[
                        styles.unitChip,
                        formData.unit === unit && styles.unitChipActive
                      ]}
                    >
                      <Text style={[
                        styles.unitChipText,
                        formData.unit === unit && styles.unitChipTextActive
                      ]}>
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {inventoryCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setFormData(prev => ({ ...prev, category }))}
                    style={[
                      styles.categoryChip,
                      formData.category === category && styles.categoryChipActive
                    ]}
                  >
                    <Ionicons 
                      name={getCategoryIcon(category) as any} 
                      size={16} 
                      color={formData.category === category ? 'white' : '#64748b'} 
                    />
                    <Text style={[
                      styles.categoryChipText,
                      formData.category === category && styles.categoryChipTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Expiration Date */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Expiration Date</Text>
                <Text style={styles.optionalLabel}>(Optional)</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.expirationDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, expirationDate: text }))}
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Notes</Text>
                <Text style={styles.optionalLabel}>(Optional)</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Storage tips, freshness notes, etc..."
                value={formData.notes}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                multiline
                numberOfLines={3}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          {/* Remaining Items Preview */}
          {scannedIngredients.length > 1 && currentIndex < scannedIngredients.length - 1 && (
            <View style={styles.remainingCard}>
              <View style={styles.remainingHeader}>
                <Ionicons name="layers-outline" size={18} color="#64748b" />
                <Text style={styles.remainingTitle}>
                  {scannedIngredients.length - currentIndex - 1} more item{scannedIngredients.length - currentIndex - 1 > 1 ? 's' : ''} remaining
                </Text>
              </View>
              <View style={styles.remainingList}>
                {scannedIngredients.slice(currentIndex + 1, currentIndex + 4).map((item, idx) => (
                  <View key={idx} style={styles.remainingItem}>
                    <Ionicons name="ellipse" size={6} color="#94a3b8" />
                    <Text style={styles.remainingItemText}>{item.name}</Text>
                    <Text style={styles.remainingItemConfidence}>{item.confidence}%</Text>
                  </View>
                ))}
                {scannedIngredients.length - currentIndex - 1 > 3 && (
                  <Text style={styles.moreItemsText}>
                    +{scannedIngredients.length - currentIndex - 4} more...
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Already Added Items */}
          {addedItems.length > 0 && (
            <View style={styles.addedCard}>
              <View style={styles.addedHeader}>
                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                <Text style={styles.addedTitle}>
                  {addedItems.length} item{addedItems.length > 1 ? 's' : ''} added
                </Text>
              </View>
              <View style={styles.addedList}>
                {addedItems.slice(-3).reverse().map((item, idx) => (
                  <View key={idx} style={styles.addedItem}>
                    <Ionicons name="checkmark" size={14} color="#10b981" />
                    <Text style={styles.addedItemText}>
                      {item.name} - {item.amount} {item.unit}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={handleRemove}
          >
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={handleSkip}
          >
            <Ionicons name="arrow-forward" size={18} color="#64748b" />
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveItem}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButtonGradient}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.saveButtonText}>
                {currentIndex < scannedIngredients.length - 1 ? 'Next' : 'Finish'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  placeholderButton: {
    width: 32,
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
  progressContainer: {
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  optionalLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: '#1e293b',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  unitScroll: {
    maxHeight: 120,
  },
  unitScrollContent: {
    flexDirection: 'row',
    gap: 6,
  },
  unitChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  unitChipActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  unitChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  unitChipTextActive: {
    color: 'white',
  },
  categoryScroll: {
    marginTop: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryChipTextActive: {
    color: 'white',
  },
  remainingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  remainingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  remainingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  remainingList: {
    gap: 8,
  },
  remainingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  remainingItemText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  remainingItemConfidence: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 4,
  },
  addedCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  addedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  addedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
  },
  addedList: {
    gap: 8,
  },
  addedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addedItemText: {
    fontSize: 14,
    color: '#047857',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 32,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: 'white',
  },
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 8,
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  skipButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    gap: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  saveButton: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
