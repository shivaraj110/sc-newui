import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

export default function AddScreen() {
  const router = useRouter();

  const handleAction = (action: string) => {
    switch (action) {
      case 'create':
        router.push('/add-recipe');
        break;
      case 'scan':
        router.push('/scan');
        break;
      case 'import':
        alert('Web import feature coming soon!');
        break;
      case 'shopping':
        router.push('/shopping');
        break;
      case 'mealplan':
        router.push('/mealplan');
        break;
    }
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
          <Ionicons name="add-circle" size={32} color="white" />
          <Text style={styles.headerTitle}>Add Recipe</Text>
          <Text style={styles.headerSubtitle}>Create, scan, or import your recipes</Text>
        </LinearGradient>

        {/* Main Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create Recipe</Text>
          
          <TouchableOpacity
            onPress={() => handleAction('create')}
            style={styles.primaryActionCard}
          >
            <LinearGradient
              colors={['#0ea5e9', '#0284c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryActionGradient}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="create" size={32} color="white" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Create New Recipe</Text>
                <Text style={styles.actionSubtitle}>Add ingredients, steps, and photos</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAction('scan')}
            style={styles.actionCard}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="camera" size={28} color="white" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Scan Ingredients</Text>
                <Text style={styles.actionSubtitle}>Use camera to identify ingredients</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAction('import')}
            style={styles.actionCard}
          >
            <LinearGradient
              colors={['#a855f7', '#9333ea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="link" size={28} color="white" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Import from Web</Text>
                <Text style={styles.actionSubtitle}>Import recipes from websites</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              onPress={() => handleAction('shopping')}
              style={styles.quickActionCard}
            >
              <View style={styles.quickActionIconContainer}>
                <LinearGradient
                  colors={['#f97316', '#ea580c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.quickActionIcon}
                >
                  <Ionicons name="basket" size={24} color="white" />
                </LinearGradient>
              </View>
              <Text style={styles.quickActionTitle}>Shopping{'\n'}List</Text>
              <Text style={styles.quickActionSubtitle}>Manage ingredients to buy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAction('mealplan')}
              style={styles.quickActionCard}
            >
              <View style={styles.quickActionIconContainer}>
                <LinearGradient
                  colors={['#06b6d4', '#0891b2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.quickActionIcon}
                >
                  <Ionicons name="calendar" size={24} color="white" />
                </LinearGradient>
              </View>
              <Text style={styles.quickActionTitle}>Meal{'\n'}Planning</Text>
              <Text style={styles.quickActionSubtitle}>Plan your weekly meals</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          
          <View style={styles.recentCard}>
            <View style={styles.recentIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
            <View style={styles.recentContent}>
              <Text style={styles.recentTitle}>Recipe Created</Text>
              <Text style={styles.recentSubtitle}>Spaghetti Carbonara • 2 hours ago</Text>
            </View>
          </View>

          <View style={styles.recentCard}>
            <View style={styles.recentIcon}>
              <Ionicons name="camera" size={20} color="#0ea5e9" />
            </View>
            <View style={styles.recentContent}>
              <Text style={styles.recentTitle}>Ingredients Scanned</Text>
              <Text style={styles.recentSubtitle}>5 items identified • Yesterday</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  },
  header: {
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  primaryActionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  actionIcon: {
    marginRight: 20,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIconContainer: {
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 20,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  recentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentIcon: {
    marginRight: 16,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  recentSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  lastSection: {
    paddingBottom: 100,
  },
});