import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mockShoppingList, shoppingCategories } from '../data/shoppingList';
import { LinearGradient } from 'expo-linear-gradient';

export default function ShoppingScreen() {
  const router = useRouter();
  const [shoppingList, setShoppingList] = useState(mockShoppingList);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('pieces');

  const toggleItem = (itemId: string) => {
    setShoppingList(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const deleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setShoppingList(prev => prev.filter(item => item.id !== itemId))
        }
      ]
    );
  };

  const addNewItem = () => {
    if (!newItemName.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      amount: parseFloat(newItemAmount) || 1,
      unit: newItemUnit,
      isChecked: false,
      category: 'Pantry'
    };

    setShoppingList(prev => [...prev, newItem]);
    setNewItemName('');
    setNewItemAmount('');
    setShowAddItem(false);
  };

  const clearCompleted = () => {
    const completedCount = shoppingList.filter(item => item.isChecked).length;
    if (completedCount === 0) return;

    Alert.alert(
      'Clear Completed',
      `Remove ${completedCount} completed items from your list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => setShoppingList(prev => prev.filter(item => !item.isChecked))
        }
      ]
    );
  };

  const filteredItems = shoppingList.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const uncheckedCount = shoppingList.filter(item => !item.isChecked).length;
  const checkedCount = shoppingList.filter(item => item.isChecked).length;
  const progressPercentage = shoppingList.length > 0 ? (checkedCount / shoppingList.length) * 100 : 0;

  // Group items by category
  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, typeof filteredItems>);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Produce': 'leaf',
      'Dairy': 'water',
      'Meat': 'restaurant',
      'Bakery': 'cafe',
      'Pantry': 'archive',
      'Frozen': 'snow',
    };
    return icons[category] || 'basket';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, [string, string]> = {
      'Produce': ['#10b981', '#059669'],
      'Dairy': ['#06b6d4', '#0891b2'],
      'Meat': ['#ef4444', '#dc2626'],
      'Bakery': ['#f59e0b', '#d97706'],
      'Pantry': ['#a855f7', '#9333ea'],
      'Frozen': ['#3b82f6', '#2563eb'],
    };
    return colors[category] || ['#64748b', '#475569'];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
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
              <Ionicons name="basket" size={28} color="white" />
              <Text style={styles.headerTitle}>Shopping List</Text>
            </View>
            <TouchableOpacity onPress={() => setShowAddItem(true)} style={styles.addButton}>
              <View style={styles.addButtonContainer}>
                <Ionicons name="add" size={20} color="#0ea5e9" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            {uncheckedCount} items remaining • {checkedCount} completed
          </Text>
        </LinearGradient>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Shopping Progress</Text>
            <Text style={styles.progressPercent}>{Math.round(progressPercentage)}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.progressFill, { width: `${progressPercentage}%` }]}
              />
            </View>
          </View>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatNumber}>{uncheckedCount}</Text>
              <Text style={styles.progressStatLabel}>Remaining</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatNumber}>{checkedCount}</Text>
              <Text style={styles.progressStatLabel}>Completed</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatNumber}>{shoppingList.length}</Text>
              <Text style={styles.progressStatLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search" size={20} color="#0ea5e9" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#64748b"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
            >
              {!selectedCategory && (
                <LinearGradient
                  colors={['#0ea5e9', '#0284c7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryChipGradient}
                />
              )}
              <Text style={[styles.categoryChipText, !selectedCategory && styles.categoryChipTextActive]}>
                All ({shoppingList.length})
              </Text>
            </TouchableOpacity>
            {shoppingCategories.map((category) => {
              const categoryCount = shoppingList.filter(item => item.category === category).length;
              if (categoryCount === 0) return null;
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
                >
                  {selectedCategory === category && (
                    <LinearGradient
                      colors={['#0ea5e9', '#0284c7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.categoryChipGradient}
                    />
                  )}
                  <View style={styles.categoryChipContent}>
                    <Ionicons 
                      name={getCategoryIcon(category) as any} 
                      size={16} 
                      color={selectedCategory === category ? 'white' : '#64748b'} 
                    />
                    <Text style={[styles.categoryChipText, selectedCategory === category && styles.categoryChipTextActive]}>
                      {category} ({categoryCount})
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Actions */}
        {checkedCount > 0 && (
          <View style={styles.actionsSection}>
            <TouchableOpacity onPress={clearCompleted} style={styles.clearButton}>
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.clearGradient}
              >
                <Ionicons name="trash" size={16} color="white" />
                <Text style={styles.clearText}>Clear Completed ({checkedCount})</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Shopping List */}
        <View style={[styles.listContainer, styles.lastSection]}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="basket-outline" size={64} color="#cbd5e1" />
              </View>
              <Text style={styles.emptyStateTitle}>No items found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try a different search term' : 'Add items to your shopping list'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity style={styles.addFirstItemButton} onPress={() => setShowAddItem(true)}>
                  <LinearGradient
                    colors={['#0ea5e9', '#0284c7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.addFirstItemGradient}
                  >
                    <Ionicons name="add" size={20} color="white" />
                    <Text style={styles.addFirstItemText}>Add Your First Item</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ) : selectedCategory ? (
            // Show items for selected category
            filteredItems.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <TouchableOpacity onPress={() => toggleItem(item.id)} style={styles.itemLeft}>
                  <View style={[styles.checkbox, item.isChecked && styles.checkboxChecked]}>
                    {item.isChecked ? (
                      <Ionicons name="checkmark" size={16} color="white" />
                    ) : (
                      <View style={styles.checkboxEmpty} />
                    )}
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, item.isChecked && styles.itemNameChecked]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.itemAmount, item.isChecked && styles.itemAmountChecked]}>
                      {item.amount} {item.unit}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            // Show items grouped by category
            Object.entries(groupedItems).map(([category, items]) => (
              <View key={category} style={styles.categoryGroup}>
                <View style={styles.categoryHeader}>
                  <LinearGradient
                    colors={getCategoryColor(category)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.categoryIcon}
                  >
                    <Ionicons name={getCategoryIcon(category) as any} size={16} color="white" />
                  </LinearGradient>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <Text style={styles.categoryCount}>({items.length})</Text>
                </View>
                {items.map((item) => (
                  <View key={item.id} style={styles.listItem}>
                    <TouchableOpacity onPress={() => toggleItem(item.id)} style={styles.itemLeft}>
                      <View style={[styles.checkbox, item.isChecked && styles.checkboxChecked]}>
                        {item.isChecked ? (
                          <Ionicons name="checkmark" size={16} color="white" />
                        ) : (
                          <View style={styles.checkboxEmpty} />
                        )}
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={[styles.itemName, item.isChecked && styles.itemNameChecked]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.itemAmount, item.isChecked && styles.itemAmountChecked]}>
                          {item.amount} {item.unit}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Item Modal */}
      <Modal visible={showAddItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Item</Text>
              <TouchableOpacity onPress={() => setShowAddItem(false)} style={styles.modalClose}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Item Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter item name"
                  value={newItemName}
                  onChangeText={setNewItemName}
                  autoFocus
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Amount</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="1"
                    keyboardType="numeric"
                    value={newItemAmount}
                    onChangeText={setNewItemAmount}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Unit</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="pieces"
                    value={newItemUnit}
                    onChangeText={setNewItemUnit}
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowAddItem(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAddButton} onPress={addNewItem}>
                <LinearGradient
                  colors={['#0ea5e9', '#0284c7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalAddGradient}
                >
                  <Text style={styles.modalAddText}>Add Item</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
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
  addButton: {
    padding: 4,
  },
  addButtonContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0ea5e9',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    alignItems: 'center',
    flex: 1,
  },
  progressStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIconContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  clearButton: {
    padding: 4,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoriesScroll: {
    marginTop: 4,
  },
  categoryChip: {
    marginRight: 12,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryChipActive: {
    borderColor: '#0ea5e9',
  },
  categoryChipGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    zIndex: 1,
  },
  categoryChipTextActive: {
    color: 'white',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  clearGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  categoryGroup: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkboxEmpty: {
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  itemAmount: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  itemAmountChecked: {
    color: '#94a3b8',
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  addFirstItemButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  addFirstItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  addFirstItemText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  modalClose: {
    padding: 4,
  },
  modalBody: {
    padding: 24,
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
  modalInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  inputRow: {
    flexDirection: 'row',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  modalAddButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalAddGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalAddText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  lastSection: {
    paddingBottom: 100,
  },
});