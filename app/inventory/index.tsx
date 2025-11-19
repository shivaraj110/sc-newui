import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mockInventory, inventoryCategories, InventoryItem } from '../data/inventory';
import { mockRecipes, Recipe } from '../data/recipes';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from '../components/AlertProvider';

export default function InventoryScreen() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showRecipeFilters, setShowRecipeFilters] = useState(false);
  
  // Recipe filters state
  const [recipeFilters, setRecipeFilters] = useState({
    cuisine: 'All',
    difficulty: 'All',
    cookTime: 'All',
    dietaryRestrictions: 'All',
    minMatchPercentage: 60,
    availableOnly: true
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    unit: 'pieces',
    category: 'Pantry',
    expirationDate: '',
    notes: ''
  });

  // Recipe search functionality
  const findRecipesWithAvailableIngredients = (): Array<{recipe: Recipe, matchedIngredients: number, totalIngredients: number, matchPercentage: number}> => {
    const inventoryNames = inventory.map(item => item.name.toLowerCase().trim());
    
    return mockRecipes.map(recipe => {
      let matchedIngredients = 0;
      const totalIngredients = recipe.ingredients.length;
      
      recipe.ingredients.forEach(ingredient => {
        const ingredientName = ingredient.name.toLowerCase().trim();
        
        // Enhanced matching logic
        const hasExactMatch = inventoryNames.some(invItem => invItem === ingredientName);
        const hasPartialMatch = inventoryNames.some(invItem => {
          const ingredientWords = ingredientName.split(' ');
          const inventoryWords = invItem.split(' ');
          
          // Check if any key words match (skip common words like 'fresh', 'dried', etc.)
          const keyWords = ingredientWords.filter(word => 
            !['fresh', 'dried', 'ground', 'whole', 'chopped', 'sliced', 'diced', 'cooked'].includes(word)
          );
          const invKeyWords = inventoryWords.filter(word => 
            !['fresh', 'dried', 'ground', 'whole', 'chopped', 'sliced', 'diced', 'cooked'].includes(word)
          );
          
          return keyWords.some(word => invKeyWords.includes(word)) ||
                 invKeyWords.some(word => keyWords.includes(word));
        });
        
        if (hasExactMatch || hasPartialMatch) {
          matchedIngredients++;
        }
      });
      
      const matchPercentage = Math.round((matchedIngredients / totalIngredients) * 100);
      
      return {
        recipe,
        matchedIngredients,
        totalIngredients,
        matchPercentage
      };
    }).filter(result => result.matchedIngredients > 0)
      .sort((a, b) => {
        // Sort by match percentage first, then by total matched ingredients
        if (b.matchPercentage === a.matchPercentage) {
          return b.matchedIngredients - a.matchedIngredients;
        }
        return b.matchPercentage - a.matchPercentage;
      })
      .slice(0, 6); // Show top 6 recipes
  };

  const availableRecipes = findRecipesWithAvailableIngredients();

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      unit: 'pieces',
      category: 'Pantry',
      expirationDate: '',
      notes: ''
    });
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddItem(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      amount: item.amount.toString(),
      unit: item.unit,
      category: item.category,
      expirationDate: item.expirationDate || '',
      notes: item.notes || ''
    });
    setEditingItem(item);
    setShowAddItem(true);
  };

  const handleSaveItem = () => {
    if (!formData.name.trim() || !formData.amount.trim()) {
      Alert.error('Missing Information', 'Please enter both name and amount.');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.error('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    if (editingItem) {
      // Edit existing item
      setInventory(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formData.name.trim(),
                amount: amount,
                unit: formData.unit,
                category: formData.category,
                expirationDate: formData.expirationDate || undefined,
                notes: formData.notes || undefined
              }
            : item
        )
      );
      Alert.success('Item Updated', `${formData.name} has been updated.`);
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        amount: amount,
        unit: formData.unit,
        category: formData.category,
        expirationDate: formData.expirationDate || undefined,
        dateAdded: new Date().toISOString().split('T')[0],
        notes: formData.notes || undefined
      };
      setInventory(prev => [...prev, newItem]);
      Alert.success('Item Added', `${formData.name} has been added to your inventory.`);
    }

    resetForm();
    setShowAddItem(false);
  };

  const deleteItem = (item: InventoryItem) => {
    Alert.confirm(
      'Delete Item',
      `Remove "${item.name}" from your inventory?`,
      () => {
        setInventory(prev => prev.filter(i => i.id !== item.id));
        Alert.success('Item Deleted', `${item.name} has been removed.`);
      }
    );
  };

  const filteredItems = inventory.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, InventoryItem[]>);

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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, [string, string]> = {
      'Fruits': ['#10b981', '#059669'],
      'Vegetables': ['#22c55e', '#16a34a'],
      'Dairy': ['#06b6d4', '#0891b2'],
      'Meat': ['#ef4444', '#dc2626'],
      'Seafood': ['#3b82f6', '#2563eb'],
      'Bakery': ['#f59e0b', '#d97706'],
      'Pantry': ['#a855f7', '#9333ea'],
      'Spices': ['#ec4899', '#db2777'],
      'Frozen': ['#0ea5e9', '#0284c7'],
      'Beverages': ['#8b5cf6', '#7c3aed'],
      'Snacks': ['#f97316', '#ea580c'],
      'Condiments': ['#64748b', '#475569']
    };
    return colors[category] || ['#64748b', '#475569'];
  };

  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const today = new Date();
    return expDate < today;
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
              <Ionicons name="storefront" size={28} color="white" />
              <Text style={styles.headerTitle}>My Inventory</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => setShowRecipeFilters(true)} style={styles.recipesFilterButton}>
                <View style={styles.recipesFilterButtonContainer}>
                  <Ionicons name="restaurant" size={18} color="#0ea5e9" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
                <View style={styles.addButtonContainer}>
                  <Ionicons name="add" size={20} color="#0ea5e9" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            {inventory.length} items • Track expiration dates & quantities
          </Text>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
            <Text style={styles.statValue}>{inventory.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="warning" size={20} color="#d97706" />
            </View>
            <Text style={styles.statValue}>
              {inventory.filter(item => isExpiringSoon(item.expirationDate)).length}
            </Text>
            <Text style={styles.statLabel}>Expiring Soon</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#fef2f2' }]}>
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
            </View>
            <Text style={styles.statValue}>
              {inventory.filter(item => isExpired(item.expirationDate)).length}
            </Text>
            <Text style={styles.statLabel}>Expired</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#ede9fe' }]}>
              <Ionicons name="apps" size={20} color="#8b5cf6" />
            </View>
            <Text style={styles.statValue}>
              {Object.keys(groupedItems).length}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
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
              placeholder="Search inventory..."
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
                All ({inventory.length})
              </Text>
            </TouchableOpacity>
            {inventoryCategories.map((category) => {
              const categoryCount = inventory.filter(item => item.category === category).length;
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

        {/* Recipe Suggestions */}
        {availableRecipes.length > 0 && (
          <View style={styles.recipesSection}>
            <View style={styles.recipesSectionHeader}>
              <View style={styles.recipesTitleContainer}>
                <LinearGradient
                  colors={['#ec4899', '#db2777']}
                  style={styles.recipesIcon}
                >
                  <Ionicons name="restaurant" size={18} color="white" />
                </LinearGradient>
                <Text style={styles.recipesTitle}>Recipe Suggestions</Text>
                <View style={[styles.recipesBadge]}>
                  <Text style={styles.recipesBadgeText}>{availableRecipes.length}</Text>
                </View>
              </View>
              <Text style={styles.recipesSubtitle}>
                Recipes you can make with your current ingredients
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipesScroll}>
              {availableRecipes.map((result) => (
                <TouchableOpacity
                  key={result.recipe.id}
                  style={styles.recipeCard}
                  onPress={() => router.push(`/recipes/${result.recipe.id}` as any)}
                >
                  <View style={styles.recipeCardContent}>
                    <View style={styles.recipeCardHeader}>
                      <View style={styles.recipeCardImagePlaceholder}>
                        <Ionicons name="restaurant-outline" size={24} color="#0ea5e9" />
                      </View>
                      <View style={styles.recipeMatchBadge}>
                        <LinearGradient
                          colors={result.matchPercentage >= 80 ? ['#10b981', '#059669'] : 
                                 result.matchPercentage >= 60 ? ['#f59e0b', '#d97706'] : 
                                 ['#ef4444', '#dc2626']}
                          style={styles.recipeMatchGradient}
                        >
                          <Text style={styles.recipeMatchText}>{result.matchPercentage}%</Text>
                        </LinearGradient>
                      </View>
                    </View>
                    <Text style={styles.recipeCardTitle} numberOfLines={2}>
                      {result.recipe.title}
                    </Text>
                    <Text style={styles.recipeCardDescription} numberOfLines={2}>
                      {result.recipe.description}
                    </Text>
                    <View style={styles.recipeCardStats}>
                      <View style={styles.recipeCardStat}>
                        <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                        <Text style={styles.recipeCardStatText}>
                          {result.matchedIngredients}/{result.totalIngredients} ingredients
                        </Text>
                      </View>
                      <View style={styles.recipeCardStat}>
                        <Ionicons name="time-outline" size={14} color="#64748b" />
                        <Text style={styles.recipeCardStatText}>{result.recipe.cookTime}m</Text>
                      </View>
                    </View>
                    <View style={styles.recipeCardFooter}>
                      <View style={styles.recipeCardTags}>
                        {result.recipe.tags.slice(0, 2).map((tag, tagIndex) => (
                          <View key={tagIndex} style={styles.recipeCardTag}>
                            <Text style={styles.recipeCardTagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                      <View style={styles.recipeCardAction}>
                        <Ionicons name="arrow-forward" size={16} color="#0ea5e9" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {availableRecipes.length > 0 && (
                <TouchableOpacity
                  style={styles.viewAllRecipesCard}
                  onPress={() => router.push('/(tabs)')}
                >
                  <LinearGradient
                    colors={['#0ea5e9', '#0284c7']}
                    style={styles.viewAllRecipesGradient}
                  >
                    <Ionicons name="search" size={24} color="white" />
                    <Text style={styles.viewAllRecipesText}>View All Recipes</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        {/* Inventory List */}
        <View style={[styles.listContainer, styles.lastSection]}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="storefront-outline" size={64} color="#cbd5e1" />
              </View>
              <Text style={styles.emptyStateTitle}>No items found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try a different search term' : 'Add items to track your inventory'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity style={styles.addFirstItemButton} onPress={openAddModal}>
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
              <View 
                key={item.id} 
                style={[
                  styles.inventoryItem,
                  isExpired(item.expirationDate) && styles.itemExpired,
                  isExpiringSoon(item.expirationDate) && !isExpired(item.expirationDate) && styles.itemExpiringSoon
                ]}
              >
                <View style={styles.itemLeft}>
                  <LinearGradient
                    colors={getCategoryColor(item.category)}
                    style={styles.itemIcon}
                  >
                    <Ionicons name={getCategoryIcon(item.category) as any} size={18} color="white" />
                  </LinearGradient>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemAmount}>{item.amount} {item.unit}</Text>
                    {item.expirationDate && (
                      <Text style={[
                        styles.itemExpiration,
                        isExpired(item.expirationDate) && styles.expiredText,
                        isExpiringSoon(item.expirationDate) && !isExpired(item.expirationDate) && styles.expiringSoonText
                      ]}>
                        {isExpired(item.expirationDate) 
                          ? 'Expired' 
                          : isExpiringSoon(item.expirationDate) 
                          ? 'Expires soon' 
                          : `Expires ${item.expirationDate}`
                        }
                      </Text>
                    )}
                    {item.notes && (
                      <Text style={styles.itemNotes} numberOfLines={1}>{item.notes}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
                    <Ionicons name="create-outline" size={20} color="#0ea5e9" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteItem(item)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
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
                  <View 
                    key={item.id} 
                    style={[
                      styles.inventoryItem,
                      isExpired(item.expirationDate) && styles.itemExpired,
                      isExpiringSoon(item.expirationDate) && !isExpired(item.expirationDate) && styles.itemExpiringSoon
                    ]}
                  >
                    <View style={styles.itemLeft}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemAmount}>{item.amount} {item.unit}</Text>
                        {item.expirationDate && (
                          <Text style={[
                            styles.itemExpiration,
                            isExpired(item.expirationDate) && styles.expiredText,
                            isExpiringSoon(item.expirationDate) && !isExpired(item.expirationDate) && styles.expiringSoonText
                          ]}>
                            {isExpired(item.expirationDate) 
                              ? 'Expired' 
                              : isExpiringSoon(item.expirationDate) 
                              ? 'Expires soon' 
                              : `Expires ${item.expirationDate}`
                            }
                          </Text>
                        )}
                        {item.notes && (
                          <Text style={styles.itemNotes} numberOfLines={1}>{item.notes}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
                        <Ionicons name="create-outline" size={20} color="#0ea5e9" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteItem(item)} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Item Modal */}
      <Modal visible={showAddItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddItem(false)} style={styles.modalClose}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Item Name *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter item name"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  autoFocus
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Amount *</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="1"
                    keyboardType="numeric"
                    value={formData.amount}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Unit</Text>
                  <View style={styles.pickerContainer}>
                    <TouchableOpacity style={styles.pickerButton}>
                      <Text style={styles.pickerText}>{formData.unit}</Text>
                      <Ionicons name="chevron-down" size={16} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
                  {inventoryCategories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setFormData(prev => ({ ...prev, category }))}
                      style={[
                        styles.categoryPickerItem,
                        formData.category === category && styles.categoryPickerItemActive
                      ]}
                    >
                      <Ionicons 
                        name={getCategoryIcon(category) as any} 
                        size={16} 
                        color={formData.category === category ? 'white' : '#64748b'} 
                      />
                      <Text style={[
                        styles.categoryPickerText,
                        formData.category === category && styles.categoryPickerTextActive
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Expiration Date</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="YYYY-MM-DD (optional)"
                  value={formData.expirationDate}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, expirationDate: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.modalInput, styles.textArea]}
                  placeholder="Optional notes..."
                  value={formData.notes}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowAddItem(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveItem}>
                <LinearGradient
                  colors={['#0ea5e9', '#0284c7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalSaveGradient}
                >
                  <Text style={styles.modalSaveText}>
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Recipe Filters Modal */}
      <Modal visible={showRecipeFilters} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.recipesModalTitleContainer}>
                <LinearGradient
                  colors={['#ec4899', '#db2777']}
                  style={styles.recipesModalIcon}
                >
                  <Ionicons name="restaurant" size={20} color="white" />
                </LinearGradient>
                <Text style={styles.modalTitle}>Get Possible Recipes</Text>
              </View>
              <TouchableOpacity onPress={() => setShowRecipeFilters(false)} style={styles.modalClose}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {/* Match Percentage */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Minimum Match Percentage: {recipeFilters.minMatchPercentage}%</Text>
                <View style={styles.sliderContainer}>
                  <TouchableOpacity 
                    style={[styles.sliderButton, recipeFilters.minMatchPercentage === 50 && styles.sliderButtonActive]}
                    onPress={() => setRecipeFilters(prev => ({ ...prev, minMatchPercentage: 50 }))}
                  >
                    <Text style={[styles.sliderButtonText, recipeFilters.minMatchPercentage === 50 && styles.sliderButtonTextActive]}>50%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.sliderButton, recipeFilters.minMatchPercentage === 60 && styles.sliderButtonActive]}
                    onPress={() => setRecipeFilters(prev => ({ ...prev, minMatchPercentage: 60 }))}
                  >
                    <Text style={[styles.sliderButtonText, recipeFilters.minMatchPercentage === 60 && styles.sliderButtonTextActive]}>60%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.sliderButton, recipeFilters.minMatchPercentage === 80 && styles.sliderButtonActive]}
                    onPress={() => setRecipeFilters(prev => ({ ...prev, minMatchPercentage: 80 }))}
                  >
                    <Text style={[styles.sliderButtonText, recipeFilters.minMatchPercentage === 80 && styles.sliderButtonTextActive]}>80%</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Cuisine Filter */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cuisine Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
                  {['All', 'Italian', 'Asian', 'Mexican', 'Mediterranean', 'American', 'Indian', 'French'].map((cuisine) => (
                    <TouchableOpacity
                      key={cuisine}
                      onPress={() => setRecipeFilters(prev => ({ ...prev, cuisine }))}
                      style={[
                        styles.categoryPickerItem,
                        recipeFilters.cuisine === cuisine && styles.categoryPickerItemActive
                      ]}
                    >
                      <Text style={[
                        styles.categoryPickerText,
                        recipeFilters.cuisine === cuisine && styles.categoryPickerTextActive
                      ]}>
                        {cuisine}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Difficulty Filter */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Difficulty Level</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
                  {['All', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                    <TouchableOpacity
                      key={difficulty}
                      onPress={() => setRecipeFilters(prev => ({ ...prev, difficulty }))}
                      style={[
                        styles.categoryPickerItem,
                        recipeFilters.difficulty === difficulty && styles.categoryPickerItemActive
                      ]}
                    >
                      <Ionicons 
                        name={difficulty === 'Easy' ? 'star' : difficulty === 'Medium' ? 'star-half' : difficulty === 'Hard' ? 'flash' : 'ellipse'} 
                        size={16} 
                        color={recipeFilters.difficulty === difficulty ? 'white' : '#64748b'} 
                      />
                      <Text style={[
                        styles.categoryPickerText,
                        recipeFilters.difficulty === difficulty && styles.categoryPickerTextActive
                      ]}>
                        {difficulty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Cook Time Filter */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Maximum Cook Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
                  {['All', '15 min', '30 min', '45 min', '60 min'].map((cookTime) => (
                    <TouchableOpacity
                      key={cookTime}
                      onPress={() => setRecipeFilters(prev => ({ ...prev, cookTime }))}
                      style={[
                        styles.categoryPickerItem,
                        recipeFilters.cookTime === cookTime && styles.categoryPickerItemActive
                      ]}
                    >
                      <Ionicons 
                        name="time-outline" 
                        size={16} 
                        color={recipeFilters.cookTime === cookTime ? 'white' : '#64748b'} 
                      />
                      <Text style={[
                        styles.categoryPickerText,
                        recipeFilters.cookTime === cookTime && styles.categoryPickerTextActive
                      ]}>
                        {cookTime}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Dietary Restrictions */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Dietary Preferences</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
                  {['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb'].map((diet) => (
                    <TouchableOpacity
                      key={diet}
                      onPress={() => setRecipeFilters(prev => ({ ...prev, dietaryRestrictions: diet }))}
                      style={[
                        styles.categoryPickerItem,
                        recipeFilters.dietaryRestrictions === diet && styles.categoryPickerItemActive
                      ]}
                    >
                      <Ionicons 
                        name="leaf-outline" 
                        size={16} 
                        color={recipeFilters.dietaryRestrictions === diet ? 'white' : '#64748b'} 
                      />
                      <Text style={[
                        styles.categoryPickerText,
                        recipeFilters.dietaryRestrictions === diet && styles.categoryPickerTextActive
                      ]}>
                        {diet}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Available Only Toggle */}
              <View style={styles.inputGroup}>
                <View style={styles.toggleContainer}>
                  <View style={styles.toggleLabelContainer}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    <Text style={styles.inputLabel}>Only recipes I can fully make</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setRecipeFilters(prev => ({ ...prev, availableOnly: !prev.availableOnly }))}
                    style={[styles.toggleButton, recipeFilters.availableOnly && styles.toggleButtonActive]}
                  >
                    <View style={[styles.toggleSlider, recipeFilters.availableOnly && styles.toggleSliderActive]} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Filter Summary */}
              <View style={styles.filterSummary}>
                <View style={styles.filterSummaryHeader}>
                  <Ionicons name="funnel" size={18} color="#0ea5e9" />
                  <Text style={styles.filterSummaryTitle}>Active Filters</Text>
                </View>
                <View style={styles.filterTags}>
                  {recipeFilters.minMatchPercentage !== 60 && (
                    <View style={styles.filterTag}>
                      <Text style={styles.filterTagText}>{recipeFilters.minMatchPercentage}% match</Text>
                    </View>
                  )}
                  {recipeFilters.cuisine !== 'All' && (
                    <View style={styles.filterTag}>
                      <Text style={styles.filterTagText}>{recipeFilters.cuisine}</Text>
                    </View>
                  )}
                  {recipeFilters.difficulty !== 'All' && (
                    <View style={styles.filterTag}>
                      <Text style={styles.filterTagText}>{recipeFilters.difficulty}</Text>
                    </View>
                  )}
                  {recipeFilters.cookTime !== 'All' && (
                    <View style={styles.filterTag}>
                      <Text style={styles.filterTagText}>≤ {recipeFilters.cookTime}</Text>
                    </View>
                  )}
                  {recipeFilters.dietaryRestrictions !== 'All' && (
                    <View style={styles.filterTag}>
                      <Text style={styles.filterTagText}>{recipeFilters.dietaryRestrictions}</Text>
                    </View>
                  )}
                  {recipeFilters.availableOnly && (
                    <View style={styles.filterTag}>
                      <Text style={styles.filterTagText}>Available ingredients</Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => {
                  setRecipeFilters({
                    cuisine: 'All',
                    difficulty: 'All',
                    cookTime: 'All',
                    dietaryRestrictions: 'All',
                    minMatchPercentage: 60,
                    availableOnly: true
                  });
                }}
              >
                <Text style={styles.modalCancelText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveButton} 
                onPress={() => {
                  setShowRecipeFilters(false);
                  router.push('/(tabs)');
                }}
              >
                <LinearGradient
                  colors={['#ec4899', '#db2777']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalSaveGradient}
                >
                  <Ionicons name="search" size={16} color="white" />
                  <Text style={styles.modalSaveText}>Find Recipes</Text>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
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
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  itemExpired: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  itemExpiringSoon: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
    marginBottom: 2,
  },
  itemExpiration: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  expiredText: {
    color: '#dc2626',
    fontWeight: '700',
  },
  expiringSoonText: {
    color: '#d97706',
    fontWeight: '600',
  },
  itemNotes: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
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
  lastSection: {
    paddingBottom: 100,
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
    maxHeight: '80%',
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
    maxHeight: 400,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#1e293b',
  },
  categoryPicker: {
    marginTop: 8,
  },
  categoryPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  categoryPickerItemActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  categoryPickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryPickerTextActive: {
    color: 'white',
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
  modalSaveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalSaveGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  
  // Recipe suggestions styles
  recipesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  recipesSectionHeader: {
    marginBottom: 16,
  },
  recipesTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipesIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recipesTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    flex: 1,
  },
  recipesBadge: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recipesBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0ea5e9',
  },
  recipesSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 18,
  },
  recipesScroll: {
    marginTop: 4,
  },
  recipeCard: {
    width: 260,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeCardContent: {
    flex: 1,
  },
  recipeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recipeCardImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeMatchBadge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  recipeMatchGradient: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recipeMatchText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  recipeCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
    lineHeight: 20,
  },
  recipeCardDescription: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 16,
  },
  recipeCardStats: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 12,
  },
  recipeCardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recipeCardStatText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  recipeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  recipeCardTags: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  recipeCardTag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recipeCardTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  recipeCardAction: {
    padding: 4,
  },
  viewAllRecipesCard: {
    width: 160,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  viewAllRecipesGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  viewAllRecipesText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },

  // New styles for recipe filters
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  recipesFilterButton: {
    padding: 4,
  },
  recipesFilterButtonContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  recipesModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recipesModalIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  sliderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  sliderButtonActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  sliderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  sliderButtonTextActive: {
    color: 'white',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e2e8f0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#10b981',
  },
  toggleSlider: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleSliderActive: {
    transform: [{ translateX: 20 }],
  },
  filterSummary: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  filterSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTag: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  filterTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});