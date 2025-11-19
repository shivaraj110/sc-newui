import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function NotificationsScreen() {
  const router = useRouter();
  
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    newRecipes: true,
    mealReminders: true,
    shoppingList: false,
    favorites: true,
    social: true,
    emailNewsletter: true,
    emailTips: false,
    emailPromotions: false,
    quietHours: true,
    vibration: true,
    sound: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const pushSettings = [
    {
      title: "Recipe Notifications",
      description: "New recipes matching your preferences",
      icon: "restaurant-outline",
      key: "newRecipes",
      color: "#10b981",
      bgColor: "#ecfdf5",
    },
    {
      title: "Meal Reminders",
      description: "Reminders for planned meals",
      icon: "time-outline",
      key: "mealReminders",
      color: "#f59e0b",
      bgColor: "#fef3c7",
    },
    {
      title: "Shopping List",
      description: "Updates to your shopping list",
      icon: "basket-outline",
      key: "shoppingList",
      color: "#ef4444",
      bgColor: "#fef2f2",
    },
    {
      title: "Favorites",
      description: "Activity on your favorite recipes",
      icon: "heart-outline",
      key: "favorites",
      color: "#ec4899",
      bgColor: "#fce7f3",
    },
    {
      title: "Social",
      description: "Comments and likes on your recipes",
      icon: "people-outline",
      key: "social",
      color: "#8b5cf6",
      bgColor: "#f3e8ff",
    },
  ];

  const emailSettings = [
    {
      title: "Weekly Newsletter",
      description: "Curated recipes and cooking tips",
      icon: "mail-outline",
      key: "emailNewsletter",
      color: "#0ea5e9",
      bgColor: "#e0f2fe",
    },
    {
      title: "Cooking Tips",
      description: "Expert tips and techniques",
      icon: "bulb-outline",
      key: "emailTips",
      color: "#f59e0b",
      bgColor: "#fef3c7",
    },
    {
      title: "Promotions",
      description: "Special offers and deals",
      icon: "pricetag-outline",
      key: "emailPromotions",
      color: "#10b981",
      bgColor: "#ecfdf5",
    },
  ];

  const appSettings = [
    {
      title: "Quiet Hours (10 PM - 8 AM)",
      description: "Mute notifications during these hours",
      icon: "moon-outline",
      key: "quietHours",
      color: "#6b7280",
      bgColor: "#f1f5f9",
    },
    {
      title: "Vibration",
      description: "Vibrate for notifications",
      icon: "phone-portrait-outline",
      key: "vibration",
      color: "#06b6d4",
      bgColor: "#cffafe",
    },
    {
      title: "Sound",
      description: "Play sound for notifications",
      icon: "volume-high-outline",
      key: "sound",
      color: "#8b5cf6",
      bgColor: "#f3e8ff",
    },
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Master Toggle */}
        <View style={styles.masterSection}>
          <View style={styles.masterCard}>
            <LinearGradient
              colors={notifications.pushEnabled ? ["#0ea5e9", "#0284c7"] : ["#f1f5f9", "#e2e8f0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.masterGradient}
            >
              <View style={styles.masterIcon}>
                <Ionicons 
                  name={notifications.pushEnabled ? "notifications" : "notifications-off"} 
                  size={24} 
                  color="white" 
                />
              </View>
              <View style={styles.masterContent}>
                <Text style={styles.masterTitle}>Push Notifications</Text>
                <Text style={styles.masterDescription}>
                  {notifications.pushEnabled ? "All notifications enabled" : "All notifications disabled"}
                </Text>
              </View>
              <Switch
                value={notifications.pushEnabled}
                onValueChange={() => handleToggle("pushEnabled")}
                trackColor={{ false: "#cbd5e1", true: "#bfdbfe" }}
                thumbColor={notifications.pushEnabled ? "white" : "#f1f5f9"}
                ios_backgroundColor="#cbd5e1"
              />
            </LinearGradient>
          </View>
        </View>

        {/* Push Notifications */}
        {notifications.pushEnabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Push Notifications</Text>
            
            {pushSettings.map((setting) => (
              <View key={setting.key} style={styles.settingItem}>
                <View style={[styles.settingIcon, { backgroundColor: setting.bgColor }]}>
                  <Ionicons name={setting.icon as any} size={20} color={setting.color} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={notifications[setting.key as keyof typeof notifications] as boolean}
                  onValueChange={() => handleToggle(setting.key as keyof typeof notifications)}
                  trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                  thumbColor={notifications[setting.key as keyof typeof notifications] ? "#0ea5e9" : "#cbd5e1"}
                  ios_backgroundColor="#e2e8f0"
                />
              </View>
            ))}
          </View>
        )}

        {/* Email Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Notifications</Text>
          
          {emailSettings.map((setting) => (
            <View key={setting.key} style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: setting.bgColor }]}>
                <Ionicons name={setting.icon as any} size={20} color={setting.color} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={notifications[setting.key as keyof typeof notifications] as boolean}
                onValueChange={() => handleToggle(setting.key as keyof typeof notifications)}
                trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                thumbColor={notifications[setting.key as keyof typeof notifications] ? "#0ea5e9" : "#cbd5e1"}
                ios_backgroundColor="#e2e8f0"
              />
            </View>
          ))}
        </View>

        {/* App Settings */}
        {notifications.pushEnabled && (
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Notification Settings</Text>
            
            {appSettings.map((setting) => (
              <View key={setting.key} style={styles.settingItem}>
                <View style={[styles.settingIcon, { backgroundColor: setting.bgColor }]}>
                  <Ionicons name={setting.icon as any} size={20} color={setting.color} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={notifications[setting.key as keyof typeof notifications] as boolean}
                  onValueChange={() => handleToggle(setting.key as keyof typeof notifications)}
                  trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                  thumbColor={notifications[setting.key as keyof typeof notifications] ? "#0ea5e9" : "#cbd5e1"}
                  ios_backgroundColor="#e2e8f0"
                />
              </View>
            ))}

            {/* Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Ionicons name="information-circle" size={20} color="#0ea5e9" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Notification Permissions</Text>
                <Text style={styles.infoDescription}>
                  You can change app notification permissions in your device settings at any time.
                </Text>
              </View>
            </View>
          </View>
        )}
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
  masterSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  masterCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  masterGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  masterIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 8,
    marginRight: 16,
  },
  masterContent: {
    flex: 1,
  },
  masterTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  masterDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  infoIcon: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 4,
    marginRight: 12,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0c4a6e",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: "#075985",
    lineHeight: 18,
  },
  lastSection: {
    paddingBottom: 100,
  },
});