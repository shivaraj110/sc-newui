import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from '../components/AlertProvider';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export default function AddRecipeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '' }
  ]);
  const [instructions, setInstructions] = useState(['']);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.error('Error', 'Please enter a recipe title');
      return;
    }

    // Mock save - in real app would save to database
    Alert.success(
      'Recipe Saved!',
      `"${title}" has been added to your recipes.`,
      () => {
        Alert.alert(
          'What\'s Next?',
          'Would you like to add another recipe or go back?',
          [
            { text: 'Add Another', onPress: () => {
              setTitle('');
              setDescription('');
              setCookTime('');
              setServings('');
              setIngredients([{ name: '', amount: '', unit: '' }]);
              setInstructions(['']);
            }},
            { text: 'Done', onPress: () => router.back() }
          ]
        );
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#0ea5e9', '#0284c7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Recipe</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Basic Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Recipe Title"
                placeholderTextColor="#9ca3af"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.inputWithIcon}>
                  <View style={styles.inputIcon}>
                    <Ionicons name="time-outline" size={18} color="#0ea5e9" />
                  </View>
                  <TextInput
                    style={styles.inputWithIconText}
                    placeholder="Cook Time"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={cookTime}
                    onChangeText={setCookTime}
                  />
                  <Text style={styles.inputSuffix}>mins</Text>
                </View>
              </View>
              
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.inputWithIcon}>
                  <View style={styles.inputIcon}>
                    <Ionicons name="people-outline" size={18} color="#0ea5e9" />
                  </View>
                  <TextInput
                    style={styles.inputWithIconText}
                    placeholder="Servings"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={servings}
                    onChangeText={setServings}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Ingredients Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addButtonGradient}
                >
                  <Ionicons name="add" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <View style={styles.ingredientInputs}>
                  <View style={[styles.inputContainer, styles.ingredientName]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingredient"
                      placeholderTextColor="#9ca3af"
                      value={ingredient.name}
                      onChangeText={(value) => updateIngredient(index, 'name', value)}
                    />
                  </View>
                  
                  <View style={[styles.inputContainer, styles.ingredientAmount]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Amount"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      value={ingredient.amount}
                      onChangeText={(value) => updateIngredient(index, 'amount', value)}
                    />
                  </View>
                  
                  <View style={[styles.inputContainer, styles.ingredientUnit]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Unit"
                      placeholderTextColor="#9ca3af"
                      value={ingredient.unit}
                      onChangeText={(value) => updateIngredient(index, 'unit', value)}
                    />
                  </View>
                </View>
                
                <TouchableOpacity
                  onPress={() => removeIngredient(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Instructions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <TouchableOpacity onPress={addInstruction} style={styles.addButton}>
                <LinearGradient
                  colors={['#a855f7', '#9333ea']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addButtonGradient}
                >
                  <Ionicons name="add" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <View style={styles.stepNumber}>
                  <LinearGradient
                    colors={['#0ea5e9', '#0284c7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.stepNumberGradient}
                  >
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </LinearGradient>
                </View>
                
                <View style={[styles.inputContainer, styles.instructionInput]}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder={`Step ${index + 1} instructions...`}
                    placeholderTextColor="#9ca3af"
                    multiline
                    textAlignVertical="top"
                    value={instruction}
                    onChangeText={(value) => updateInstruction(index, value)}
                  />
                </View>
                
                <TouchableOpacity
                  onPress={() => removeInstruction(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Photo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photo</Text>
            <TouchableOpacity style={styles.photoUpload}>
              <LinearGradient
                colors={['#f8fafc', '#e2e8f0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.photoUploadGradient}
              >
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={32} color="#0ea5e9" />
                </View>
                <Text style={styles.photoUploadText}>Add Recipe Photo</Text>
                <Text style={styles.photoUploadSubtext}>Tap to upload image</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
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
  headerGradient: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
  saveButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonGradient: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputWithIconText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  inputSuffix: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ingredientInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  ingredientName: {
    flex: 2,
    marginBottom: 0,
  },
  ingredientAmount: {
    flex: 1,
    marginBottom: 0,
  },
  ingredientUnit: {
    flex: 1,
    marginBottom: 0,
  },
  removeButton: {
    padding: 12,
    marginLeft: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    marginRight: 12,
    marginTop: 4,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumberGradient: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  instructionInput: {
    flex: 1,
    marginBottom: 0,
  },
  photoUpload: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  photoUploadGradient: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  photoUploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  photoUploadSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  bottomSpacing: {
    height: 20,
  },
});