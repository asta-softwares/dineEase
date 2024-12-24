import React, { useState, useEffect } from "react";
import { Alert, Animated, TouchableOpacity, View, Text, FlatList, Dimensions, Platform, StyleSheet, SafeAreaView } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import CollapsibleTabViewHeader from "react-native-tab-view-header";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../styles/typography";
import { colors } from '../styles/colors';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const HEADER_HEIGHT = 350;  // Total header height
const TAB_BAR_HEIGHT = 48;  // Tab bar height
const STATUS_BAR_HEIGHT = getStatusBarHeight();
const STICKY_HEADER_HEIGHT = 60;  // Height of header that remains when collapsed

const DetailScreen = () => {
    const navigation = useNavigation();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isTabBarSticky, setIsTabBarSticky] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: isTabBarSticky ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isTabBarSticky]);

    const handleBack = () => {
        navigation.goBack();
    };

    const HeaderTitle = ({ isSticky = false }) => (
        <View style={[
            styles.headerTitleContainer,
            isSticky ? {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: TAB_BAR_HEIGHT,
                backgroundColor: colors.background,
                position: 'relative',
                paddingHorizontal: 40,
            } : {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 16,
                marginBottom: 8,
                paddingHorizontal: 40,
                width: '100%',
            }
        ]}>
            <Text style={[
                typography.h2,
                { 
                    color: isSticky ? colors.text.black : colors.text.white,
                    textAlign: 'center',
                    fontSize: isSticky ? 18 : typography.h2.fontSize,
                }
            ]}>
                Restaurant Name
            </Text>
        </View>
    );

    const slideData = [{
        key: 'first',
        title: 'First',
        Wrapper: Animated.FlatList,
        WrapperProps: {
            data: Array(20).fill(1),
            renderItem: ({ item, index }) => (
                <View style={{ backgroundColor: index % 2 ? 'lightgray' : 'gray', height: WINDOW_HEIGHT / 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>
                        {`Index: ${index}`}
                    </Text>
                </View>
            ),
            keyExtractor: (_item, index) => index
        }
    }, {
        key: 'second',
        title: 'Second',
        Wrapper: Animated.FlatList,
        WrapperProps: {
            data: Array(40).fill(1),
            renderItem: ({ item, index }) => (
                <View style={{ backgroundColor: index % 2 ? 'orange' : 'pink', height: WINDOW_HEIGHT / 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>
                        {`Index: ${index}`}
                    </Text>
                </View>
            ),
            keyExtractor: (_item, index) => index
        }
    }];

    const renderHeaderScroll = () => (
        <FlatList
            style={{ width: '100%', height: 50 }}
            data={Array(40).fill(1)}
            renderItem={({ item, index }) =>
                <Text style={{ backgroundColor: 'orange', width: 50, height: 50, textAlign: 'center' }}>
                    {index + ''}
                </Text>
            }
            keyExtractor={(_, i) => i}
            horizontal
        />
    );

    const renderTabBar = (props) => {
        const { navigationState } = props;
        return (
            <View style={{ 
                flexDirection: 'column',
                backgroundColor: colors.background,
            }}>
                <Animated.View style={{ 
                    opacity: fadeAnim,
                    transform: [{
                        translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-10, 0],
                        })
                    }]
                }}>
                    {isTabBarSticky && (
                        <View style={styles.stickyHeader}>
                            <TouchableOpacity
                                onPress={handleBack}
                                style={[styles.backButton, styles.stickyBackButton]}
                            >
                                <Ionicons name="arrow-back" size={24} color={colors.text.black} />
                            </TouchableOpacity>
                            <View style={styles.stickyTitleContainer}>
                                <Text style={[
                                    typography.h2,
                                    styles.stickyTitle,
                                ]}>
                                    Restaurant Name
                                </Text>
                            </View>
                        </View>
                    )}
                </Animated.View>
                <View style={[
                    styles.tabBar,
                    { 
                        borderBottomColor: colors.border,
                        elevation: isTabBarSticky ? 4 : 0,
                        shadowOpacity: isTabBarSticky ? 0.1 : 0,
                    }
                ]}>
                    {navigationState.routes.map((route, index) => {
                        const isActive = currentSlideIndex === index;
                        return (
                            <TouchableOpacity
                                key={route.key}
                                style={[
                                    styles.tab,
                                    { borderBottomColor: isActive ? colors.primary : 'transparent' }
                                ]}
                                onPress={() => setCurrentSlideIndex(index)}
                            >
                                <Text style={{
                                    color: isActive ? colors.primary : colors.text.secondary,
                                    fontWeight: isActive ? '600' : '400'
                                }}>
                                    {route.title}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <CollapsibleTabViewHeader
                tabSlides={slideData}
                tabIndex={currentSlideIndex}
                onIndexChange={i => {
                    console.log('onIndexChange: ', i);
                    setCurrentSlideIndex(i);
                }}
                renderTabBar={renderTabBar}
                renderHeader={() =>
                    <View style={[styles.header, { backgroundColor: colors.primary }]}>
                        <Animated.View style={{ 
                            opacity: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            })
                        }}>
                            <TouchableOpacity
                                onPress={handleBack}
                                style={[styles.backButton, { top: 16, zIndex: 2 }]}
                            >
                                <Ionicons name="arrow-back" size={24} color={colors.text.white} />
                            </TouchableOpacity>
                            <HeaderTitle />
                        </Animated.View>
                        <TouchableOpacity
                            style={styles.headerContent}
                            onPress={() => {
                                Alert.alert('Header Clicked');
                            }}>
                            <Text style={{ color: colors.text.white }}>
                                {'Click Header'}
                            </Text>
                        </TouchableOpacity>
                        {renderHeaderScroll()}
                    </View>
                }
                enableRefresh={false}
                tabBarStickyPosition={0}
                onTabBarStickyChange={sticky => setIsTabBarSticky(sticky)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    header: {
        height: HEADER_HEIGHT,
        paddingTop: Platform.OS === 'android' ? STATUS_BAR_HEIGHT : 0,
    },
    headerContent: {
        height: HEADER_HEIGHT - TAB_BAR_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        justifyContent: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    stickyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        height: TAB_BAR_HEIGHT,
        width: '100%',
        position: 'relative',
    },
    stickyBackButton: {
        position: 'absolute',
        left: 16,
        top: '50%',
        transform: [{ translateY: -20 }],
        backgroundColor: 'transparent',
        zIndex: 2,
    },
    stickyTitleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    stickyTitle: {
        color: colors.text.black,
        fontSize: 18,
        textAlign: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        height: TAB_BAR_HEIGHT,
        borderBottomWidth: 1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
    },
});

export default DetailScreen;