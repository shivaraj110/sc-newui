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

export default function SettingsScreen() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    darkMode: false,
    metricUnits: true,
    autoSave: true,
    offlineMode: false,
    analytics: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generalSettings = [
    {
      title: "Push Notifications",
      description: "Receive notifications about new recipes and updates",
      icon: "notifications-outline",
      key: "pushNotifications",
      color: "#0ea5e9",
      bgColor: "#e0f2fe",
    },
    {
      title: "Email Notifications",
      description: "Get weekly recipe newsletters and tips",
      icon: "mail-outline",
      key: "emailNotifications",
      color: "#10b981",
      bgColor: "#ecfdf5",
    },
    {
      title: "Dark Mode",
      description: "Switch to dark theme",
      icon: "moon-outline",
      key: "darkMode",
      color: "#6b7280",
      bgColor: "#f1f5f9",
    },
    {
      title: "Metric Units",
      description: "Use metric measurements (kg, ml, etc.)",
      icon: "speedometer-outline",
      key: "metricUnits",
      color: "#f59e0b",
      bgColor: "#fef3c7",
    },
  ];

  const appSettings = [
    {
      title: "Auto-save Recipes",
      description: "Automatically save recipe drafts",
      icon: "save-outline",
      key: "autoSave",
      color: "#8b5cf6",
      bgColor: "#f3e8ff",
    },
    {
      title: "Offline Mode",
      description: "Download recipes for offline viewing",
      icon: "download-outline",
      key: "offlineMode",
      color: "#06b6d4",
      bgColor: "#cffafe",
    },
    {
      title: "Analytics",
      description: "Help us improve the app with usage data",
      icon: "analytics-outline",
      key: "analytics",
      color: "#ec4899",
      bgColor: "#fce7f3",
    },
  ];

  const actionItems = [
    {
      title: "Export Data",
      description: "Export your recipes and data",
      icon: "download-outline",
      color: "#10b981",
      bgColor: "#ecfdf5",
      action: () => console.log("Export data"),
    },
    {
      title: "Clear Cache",
      description: "Free up storage space",
      icon: "trash-outline",
      color: "#f59e0b",
      bgColor: "#fef3c7",
      action: () => console.log("Clear cache"),
    },
    {
      title: "Reset App",
      description: "Reset all settings to default",
      icon: "refresh-outline",
      color: "#ef4444",
      bgColor: "#fef2f2",
      action: () => console.log("Reset app"),
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          {generalSettings.map((setting) => (
            <View key={setting.key} style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: setting.bgColor }]}>
                <Ionicons name={setting.icon as any} size={20} color={setting.color} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={settings[setting.key as keyof typeof settings] as boolean}
                onValueChange={() => handleToggle(setting.key as keyof typeof settings)}
                trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                thumbColor={settings[setting.key as keyof typeof settings] ? "#0ea5e9" : "#cbd5e1"}
                ios_backgroundColor="#e2e8f0"
              />
            </View>
          ))}
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
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
                value={settings[setting.key as keyof typeof settings] as boolean}
                onValueChange={() => handleToggle(setting.key as keyof typeof settings)}
                trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                thumbColor={settings[setting.key as keyof typeof settings] ? "#0ea5e9" : "#cbd5e1"}
                ios_backgroundColor="#e2e8f0"
              />
            </View>
          ))}
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          
          {actionItems.map((item) => (
            <TouchableOpacity key={item.title} style={styles.actionItem} onPress={item.action}>
              <View style={[styles.settingIcon, { backgroundColor: item.bgColor }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* About Section */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoCard}>
            <LinearGradient
              colors={["#f8fafc", "#f1f5f9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.infoGradient}
            >
              <View style={styles.appIconContainer}>
                <Ionicons name="restaurant" size={32} color="#0ea5e9" />
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>ShelfCook</Text>
                <Text style={styles.appVersion}>Version 1.0.0</Text>
                <Text style={styles.appDescription}>
                  Your personal cooking companion for discovering, creating, and planning delicious meals.
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.linksList}>
            <TouchableOpacity style={styles.linkItem}>
              <Ionicons name="help-circle-outline" size={20} color="#0ea5e9" />
              <Text style={styles.linkText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.linkItem}>
              <Ionicons name="document-text-outline" size={20} color="#0ea5e9" />
              <Text style={styles.linkText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.linkItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0ea5e9" />
              <Text style={styles.linkText}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
          </View>
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
  actionItem: {
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
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  infoGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  appIconContainer: {
    backgroundColor: "#e0f2fe",
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  linksList: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginLeft: 12,
  },
  lastSection: {
    paddingBottom: 100,
  },
});