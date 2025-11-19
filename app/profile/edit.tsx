import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "Tejaswini",
    lastName: "S C",
    email: "tejaswini.sc@example.com",
    bio: "Recipe Enthusiast & Food Blogger",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
  });

  const handleSave = () => {
    Alert.alert("Profile Updated", "Your profile has been updated successfully!", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formFields = [
    { key: "firstName", label: "First Name", icon: "person-outline", placeholder: "Enter your first name" },
    { key: "lastName", label: "Last Name", icon: "person-outline", placeholder: "Enter your last name" },
    { key: "email", label: "Email", icon: "mail-outline", placeholder: "Enter your email", keyboardType: "email-address" as const },
    { key: "phone", label: "Phone", icon: "call-outline", placeholder: "Enter your phone number", keyboardType: "phone-pad" as const },
    { key: "location", label: "Location", icon: "location-outline", placeholder: "Enter your location" },
    { key: "bio", label: "Bio", icon: "document-text-outline", placeholder: "Tell us about yourself", multiline: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#0ea5e9", "#0284c7", "#0369a1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#ffffff", "#f1f5f9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <Ionicons name="person" size={48} color="#0ea5e9" />
            </LinearGradient>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {formFields.map((field) => (
            <View key={field.key} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{field.label}</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name={field.icon as any} size={20} color="#0ea5e9" />
                </View>
                <TextInput
                  style={[styles.textInput, field.multiline && styles.textArea]}
                  value={formData[field.key as keyof typeof formData]}
                  onChangeText={(value) => handleInputChange(field.key, value)}
                  placeholder={field.placeholder}
                  placeholderTextColor="#64748b"
                  keyboardType={field.keyboardType}
                  multiline={field.multiline}
                  numberOfLines={field.multiline ? 3 : 1}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={[styles.actionSection, styles.lastSection]}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={["#10b981", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveGradient}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.saveText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  profilePictureSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "white",
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  changePhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#0ea5e9",
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  changePhotoText: {
    fontSize: 14,
    color: "#0ea5e9",
    fontWeight: "600",
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  inputIconContainer: {
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
    padding: 6,
    marginRight: 12,
    marginTop: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    minHeight: 24,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  saveButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  cancelButton: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  lastSection: {
    paddingBottom: 100,
  },
});