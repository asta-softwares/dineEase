import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopNav from '../Components/TopNav';
import LargeButton from '../Components/Buttons/LargeButton';
import Footer from './Layout/Footer';
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';
import { typography } from '../styles/typography';
import authService from '../api/services/authService';

const EditProfile = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    profile: {
      address: user?.profile?.address || '',
      city: user?.profile?.city || '',
      province: user?.profile?.province || '',
      coordinates: user?.profile?.coordinates || [],
    },
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate passwords if attempting to change
      if (formData.new_password || formData.confirm_password || formData.current_password) {
        if (formData.new_password !== formData.confirm_password) {
          Alert.alert('Error', 'New passwords do not match');
          return;
        }
        if (!formData.current_password) {
          Alert.alert('Error', 'Current password is required to change password');
          return;
        }
      }

      // Remove password fields if not changing password
      const submitData = { ...formData };
      if (!submitData.new_password) {
        delete submitData.new_password;
        delete submitData.confirm_password;
        delete submitData.current_password;
      }

      await authService.updateUser(submitData);

      // Refresh profile data
      const updatedUserData = await authService.fetchUser();
      
      // Navigate back and pass the updated data
      navigation.navigate('Profile', { 
        updatedUserData,
        timestamp: Date.now() // Force refresh
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopNav 
        handleGoBack={handleGoBack} 
        title="Edit Profile" 
        variant="solid" 
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={[typography.bodyLarge, styles.sectionTitle]}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[typography.labelMedium, styles.label]}>First Name</Text>
              <TextInput
                style={styles.input}
                value={formData.first_name}
                onChangeText={(value) => handleInputChange('first_name', value)}
                placeholder="Enter first name"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.labelMedium, styles.label]}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={formData.last_name}
                onChangeText={(value) => handleInputChange('last_name', value)}
                placeholder="Enter last name"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.labelMedium, styles.label]}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter email"
                placeholderTextColor={colors.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[typography.bodyLarge, styles.sectionTitle]}>Address</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[typography.labelMedium, styles.label]}>Street Address</Text>
              <TextInput
                style={styles.input}
                value={formData.profile.address}
                onChangeText={(value) => handleInputChange('profile.address', value)}
                placeholder="Enter street address"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.labelMedium, styles.label]}>City</Text>
              <TextInput
                style={styles.input}
                value={formData.profile.city}
                onChangeText={(value) => handleInputChange('profile.city', value)}
                placeholder="Enter city"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.labelMedium, styles.label]}>Province</Text>
              <TextInput
                style={styles.input}
                value={formData.profile.province}
                onChangeText={(value) => handleInputChange('profile.province', value)}
                placeholder="Enter province"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[typography.bodyLarge, styles.sectionTitle]}>Change Password</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[typography.labelMedium, styles.label]}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={formData.current_password}
                onChangeText={(value) => handleInputChange('current_password', value)}
                placeholder="Enter current password"
                placeholderTextColor={colors.text.secondary}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.labelMedium, styles.label]}>New Password</Text>
              <TextInput
                style={styles.input}
                value={formData.new_password}
                onChangeText={(value) => handleInputChange('new_password', value)}
                placeholder="Enter new password"
                placeholderTextColor={colors.text.secondary}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.labelMedium, styles.label]}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={formData.confirm_password}
                onChangeText={(value) => handleInputChange('confirm_password', value)}
                placeholder="Confirm new password"
                placeholderTextColor={colors.text.secondary}
                secureTextEntry
              />
            </View>
          </View>
        </ScrollView>

        <Footer keyboardAware>
          <LargeButton
            title="Save Changes"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </Footer>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 100 : 120,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 120 : 140,
  },
  section: {
    paddingVertical: layout.spacing.sm,
    marginBottom: layout.spacing.md,
  },
  sectionTitle: {
    color: colors.text.black,
    marginBottom: layout.spacing.md,
  },
  inputGroup: {
    marginBottom: layout.spacing.md,
  },
  label: {
    color: colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    ...typography.bodyMedium,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text.black,
    minHeight: 48,
  },
  submitButton: {
    marginBottom: layout.spacing.sm,
  },
});

export default EditProfile;
