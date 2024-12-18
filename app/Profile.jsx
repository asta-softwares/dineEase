import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopNav from '../Components/TopNav';
import LargeButton from '../Components/Buttons/LargeButton';
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';
import Footer from './Layout/Footer';
import { useUserStore } from '../stores/userStore';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../styles/typography';
import authService from '../api/services/authService';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const logout = useUserStore((state) => state.logout);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const userData = await authService.fetchUser();
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert(
                'Error',
                'Unable to load profile data. Please try again later.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Listen for updates from EditProfile
    useEffect(() => {
        if (route.params?.updatedUserData) {
            setUser(route.params.updatedUserData);
            // Show success message
            Alert.alert('Success', 'Profile updated successfully');
            // Clear the params to prevent duplicate alerts
            navigation.setParams({ updatedUserData: null, timestamp: null });
        }
    }, [route.params?.timestamp]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert(
                'Error',
                'Unable to logout. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile', { user });
    };

    const menuItems = [
        // { icon: 'gift-outline', label: 'Offers' },
        { icon: 'help-circle-outline', label: 'Help / Contact Us' },
        { icon: 'people-outline', label: 'Partnership' },
        { icon: 'information-circle-outline', label: 'About' },
        { icon: 'time-outline', label: 'Orders' },
    ];

    return (
        <View style={styles.container}>
            <TopNav 
                handleGoBack={handleGoBack} 
                title="Profile" 
                variant="solid" 
            />
            
            <View style={styles.mainContent}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.profile}>
                        <View style={styles.profileInfo}>
                            <Text style={[typography.h3, styles.name]}>
                                {loading ? 'Loading...' : `${user?.first_name} ${user?.last_name}`}
                            </Text>
                            <Text style={[typography.bodyMedium, styles.email]}>
                                {loading ? 'Loading...' : user?.email}
                            </Text>
                            <Text style={[typography.bodyMedium, styles.phone]}>
                                {loading ? 'Loading...' : user?.profile?.phone}
                            </Text>
                            <Text style={[typography.bodyMedium, styles.address]}>
                                {loading ? 'Loading...' : `${user?.profile?.address}, ${user?.profile?.city}, ${user?.profile?.province}`}
                            </Text>
                            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                                <Text style={[typography.labelMedium, styles.editButtonText]}>
                                    Edit profile
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.menuSection}>
                        <Text style={[typography.bodyLarge, styles.sectionTitle]}>Menu</Text>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.menuItem}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={item.icon} size={24} color={colors.text.secondary} />
                                </View>
                                <Text style={[typography.bodyLarge, styles.menuItemLabel]}>
                                    {item.label}
                                </Text>
                                <Ionicons 
                                    name="chevron-forward" 
                                    size={24} 
                                    color={colors.text.secondary} 
                                    style={styles.chevron} 
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <Footer>
                <LargeButton 
                    title="Logout"
                    onPress={handleLogout}
                    style={styles.logoutButton}
                    textStyle={styles.logoutText}
                />
            </Footer>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    mainContent: {
        flex: 1,
        marginTop: 100,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    profile: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: layout.spacing.md,
    },
    profileInfo: {
        width: '100%',
        alignItems: 'center',
        gap: 8,
    },
    name: {
        color: colors.text.black,
        textAlign: 'center',
    },
    email: {
        color: colors.text.secondary,
        textAlign: 'center',
    },
    phone: {
        color: colors.text.secondary,
        textAlign: 'center',
    },
    address: {
        color: colors.text.secondary,
        textAlign: 'center',
        marginTop: 4,
    },
    editButton: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: colors.primary,
    },
    editButtonText: {
        color: colors.white,
    },
    menuSection: {
        paddingHorizontal: layout.spacing.md,
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
        marginRight: 16,
    },
    menuItemLabel: {
        flex: 1,
        color: colors.text.black,
    },
    chevron: {
        marginLeft: 16,
    },
    logoutButton: {
        backgroundColor: colors.light,
    },
    logoutText: {
        color: colors.text.primary,
    },
});
