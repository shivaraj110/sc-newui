import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function AboutScreen() {
  const router = useRouter();

  const features = [
    {
      icon: "restaurant-outline",
      title: "Recipe Management",
      description: "Create, edit, and organize your favorite recipes",
    },
    {
      icon: "calendar-outline",
      title: "Meal Planning",
      description: "Plan your weekly meals with ease",
    },
    {
      icon: "basket-outline",
      title: "Smart Shopping",
      description: "Generate shopping lists from your meal plans",
    },
    {
      icon: "storefront-outline",
      title: "Inventory Tracking",
      description: "Keep track of ingredients in your kitchen",
    },
    {
      icon: "timer-outline",
      title: "Cooking Timer",
      description: "Never overcook your meals again",
    },
    {
      icon: "heart-outline",
      title: "Favorites",
      description: "Save and organize your favorite recipes",
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Lead Developer",
      icon: "person-outline",
    },
    {
      name: "Mike Chen",
      role: "UI/UX Designer",
      icon: "color-palette-outline",
    },
    {
      name: "Emily Davis",
      role: "Product Manager",
      icon: "bulb-outline",
    },
  ];

  const socialLinks = [
    {
      name: "Website",
      icon: "globe-outline",
      url: "https://shelfcook.app",
      color: "#0ea5e9",
    },
    {
      name: "Instagram",
      icon: "logo-instagram",
      url: "https://instagram.com/shelfcook",
      color: "#ec4899",
    },
    {
      name: "Twitter",
      icon: "logo-twitter",
      url: "https://twitter.com/shelfcook",
      color: "#1d9bf0",
    },
    {
      name: "GitHub",
      icon: "logo-github",
      url: "https://github.com/shelfcook",
      color: "#1e293b",
    },
  ];

  const handleLinkPress = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

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
        <Text style={styles.headerTitle}>About ShelfCook</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.appCard}>
            <LinearGradient
              colors={["#0ea5e9", "#0284c7", "#0369a1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.appGradient}
            >
              <View style={styles.appIcon}>
                <Ionicons name="restaurant" size={48} color="white" />
              </View>
              <Text style={styles.appName}>ShelfCook</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appTagline}>
                Your Personal Cooking Companion
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Our Mission</Text>
            <Text style={styles.descriptionText}>
              ShelfCook is designed to make cooking more enjoyable and organized. 
              Whether you're a beginner cook or a seasoned chef, our app helps you 
              discover new recipes, plan your meals, and manage your kitchen efficiently.
            </Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as any} size={24} color="#0ea5e9" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meet the Team</Text>
          
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamCard}>
              <View style={styles.memberIcon}>
                <Ionicons name={member.icon as any} size={24} color="#0ea5e9" />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By the Numbers</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Downloads</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Recipes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>5K+</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          
          <View style={styles.socialGrid}>
            {socialLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialCard}
                onPress={() => handleLinkPress(link.url)}
              >
                <View style={[styles.socialIcon, { backgroundColor: `${link.color}15` }]}>
                  <Ionicons name={link.icon as any} size={24} color={link.color} />
                </View>
                <Text style={styles.socialName}>{link.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Legal */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <View style={styles.legalCard}>
            <TouchableOpacity style={styles.legalItem}>
              <Ionicons name="document-text-outline" size={20} color="#0ea5e9" />
              <Text style={styles.legalText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
            
            <View style={styles.legalDivider} />
            
            <TouchableOpacity style={styles.legalItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0ea5e9" />
              <Text style={styles.legalText}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
            
            <View style={styles.legalDivider} />
            
            <TouchableOpacity style={styles.legalItem}>
              <Ionicons name="information-circle-outline" size={20} color="#0ea5e9" />
              <Text style={styles.legalText}>License Information</Text>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          <Text style={styles.copyrightText}>
            © 2024 ShelfCook. All rights reserved.
          </Text>
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
  appCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  appGradient: {
    padding: 32,
    alignItems: "center",
  },
  appIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 18,
    color: "rgba(255,255,255,0.95)",
    textAlign: "center",
    fontWeight: "500",
  },
  descriptionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
  },
  teamCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  memberIcon: {
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: "#64748b",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    flex: 1,
    minWidth: "22%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0ea5e9",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    textAlign: "center",
  },
  socialGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  socialCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: "22%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  socialIcon: {
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  socialName: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    textAlign: "center",
  },
  legalCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  legalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  legalText: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
    marginLeft: 12,
  },
  legalDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginLeft: 48,
  },
  copyrightText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    fontWeight: "500",
  },
  lastSection: {
    paddingBottom: 100,
  },
});