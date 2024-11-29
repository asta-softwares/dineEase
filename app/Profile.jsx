import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export default function Profile() {
  const navigation = useNavigation();

  const menuItems = [
    { icon: 'gift-outline', label: 'Offers' },
    { icon: 'help-circle-outline', label: 'Help / Contact Us' },
    { icon: 'people-outline', label: 'Partnership' },
    { icon: 'information-circle-outline', label: 'About' },
    { icon: 'time-outline', label: 'Past Orders' },
  ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={[typography.bodyLarge, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profile}>
          <Image
            source={require('../assets/profile.png')}
            style={styles.avatar}
          />
          <Text style={[typography.h3, styles.name]}>John Doe</Text>
          <Text style={[typography.bodyMedium, styles.email]}>johndoe@gmail.com</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={[typography.labelMedium, styles.editButtonText]}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[typography.bodyLarge, styles.sectionTitle]}>Menu</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={24} color={colors.text.secondary} />
              </View>
              <Text style={[typography.bodyLarge, styles.menuItemLabel]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} style={styles.chevron} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.background,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    padding: 8,
  },
  logoutText: {
    color: colors.error,
  },
  scrollView: {
    flex: 1,
    marginTop: 100,
  },
  profile: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    color: colors.text.secondary,
    marginBottom: 4,
  },
  email: {
    color: colors.text.secondary,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  editButtonText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    color: colors.text.secondary,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    flex: 1,
    marginLeft: 16,
    color: colors.text.primary,
  },
  chevron: {
    marginLeft: 16,
  },
});
