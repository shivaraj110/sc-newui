import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Alert } from '../components/AlertProvider';

export default function ProfileScreen() {
  const router = useRouter();
  
  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'edit':
        Alert.alert('Edit Profile', 'Edit profile functionality coming soon!', undefined, { type: 'info' });
        break;
      case 'recipes':
        Alert.alert('My Recipes', 'Showing your created recipes...', undefined, { type: 'info' });
        break;
      case 'inventory':
        router.push('/inventory');
        break;
      case 'settings':
        Alert.alert('Settings', 'Settings page coming soon!', undefined, { type: 'info' });
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Notification settings coming soon!', undefined, { type: 'info' });
        break;
      case 'help':
        Alert.alert('Help & Support', 'Help center and support options coming soon!', undefined, { type: 'info' });
        break;
      case 'about':
        Alert.alert('About ShelfCook', 'ShelfCook v1.0.0\n\nYour personal cooking companion for discovering, creating, and planning delicious meals.', undefined, { type: 'info' });
        break;
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality coming soon!', undefined, { type: 'info' });
  };

  const handleLogout = () => {
    Alert.confirm(
      'Logout',
      'Are you sure you want to logout?',
      () => Alert.success('Logged Out', 'You have been successfully logged out.')
    );
  };

  const stats = [
    { label: 'Created', value: '23', icon: 'restaurant-outline' },
    { label: 'Favorites', value: '47', icon: 'heart-outline' },
    { label: 'Following', value: '12', icon: 'people-outline' },
  ];

  const menuItems = [
    { title: 'Edit Profile', icon: 'person-outline', color: '#0ea5e9', bgColor: '#e0f2fe', action: 'edit' },
    { title: 'My Recipes', icon: 'restaurant-outline', color: '#10b981', bgColor: '#ecfdf5', action: 'recipes' },
    { title: 'My Inventory', icon: 'storefront-outline', color: '#f59e0b', bgColor: '#fef3c7', action: 'inventory' },
    { title: 'Settings', icon: 'settings-outline', color: '#6b7280', bgColor: '#f1f5f9', action: 'settings' },
    { title: 'Notifications', icon: 'notifications-outline', color: '#f59e0b', bgColor: '#fef3c7', action: 'notifications' },
    { title: 'Help & Support', icon: 'help-circle-outline', color: '#a855f7', bgColor: '#f3e8ff', action: 'help' },
    { title: 'About', icon: 'information-circle-outline', color: '#06b6d4', bgColor: '#cffafe', action: 'about' },
  ];

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
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#ffffff', '#f1f5f9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <Ionicons name="person" size={48} color="#0ea5e9" />
              </LinearGradient>
            </View>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userBio}>Recipe Enthusiast & Food Blogger</Text>
            
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={16} color="#0ea5e9" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={stat.label} style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name={stat.icon as any} size={20} color="#0ea5e9" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity key={item.title} style={styles.menuItem} onPress={() => handleMenuAction(item.action)}>
              <View style={[styles.menuIcon, { backgroundColor: item.bgColor }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="heart" size={16} color="#10b981" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Liked &quot;Spaghetti Carbonara&quot;</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="create" size={16} color="#f59e0b" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Created &quot;Chicken Tikka&quot;</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="bookmark" size={16} color="#0ea5e9" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Saved to &quot;Quick Meals&quot;</Text>
              <Text style={styles.activityTime}>3 days ago</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={[styles.versionSection, styles.lastSection]}>
          <Text style={styles.versionText}>ShelfCook v1.0.0</Text>
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    backgroundColor: '#e0f2fe',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  activitySection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  versionSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  lastSection: {
    paddingBottom: 100,
  },
});