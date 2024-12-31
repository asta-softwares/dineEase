import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Text, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
    useAnimatedStyle,
    interpolateColor,
    interpolate,
    withTiming,
    useSharedValue,
} from 'react-native-reanimated';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const TopNav = ({ handleGoBack, title = "The Flavorful Fork", scrollY, variant = 'transparent', showBack = true }) => {
    if (variant === 'solid') {
        return (
            <View style={[styles.topNavContainer, { backgroundColor: colors.background }]}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.topNav}>
                        {showBack ? (
                            <TouchableOpacity 
                                style={[styles.backButton, { backgroundColor: colors.background.secondary }]} 
                                onPress={handleGoBack}
                            >
                                <Ionicons name="arrow-back" size={24} color={colors.text.black} />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.placeholder} />
                        )}
                        <View style={styles.titleContainer}>
                            <Text style={[typography.h3, styles.title]}>
                                {title}
                            </Text>
                        </View>
                        <View style={styles.placeholder} />
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    const defaultScrollY = useSharedValue(0);
    const animValue = scrollY || defaultScrollY;

    const containerStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                animValue.value,
                [0, 100],
                ['transparent', colors.background]
            ),
        };
    });

    const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

    const iconStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(
                animValue.value,
                [0, 100],
                [colors.text.white, colors.text.black]
            ),
        };
    });

    const titleStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                animValue.value,
                [0, 100],
                [0, 1]
            ),
            color: colors.text.black,
        };
    });

    return (
        <Animated.View style={[styles.topNavContainer, containerStyle]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.topNav}>
                    {showBack ? (
                        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                            <AnimatedIcon 
                                name="arrow-back" 
                                size={24} 
                                style={iconStyle}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.placeholder} />
                    )}
                    <Animated.View style={[styles.titleContainer, titleStyle]}>
                        <Animated.Text style={[typography.h3, styles.title]}>
                            {title}
                        </Animated.Text>
                    </Animated.View>
                    <View style={styles.placeholder} />
                </View>
            </SafeAreaView>
        </Animated.View>
    );
}

export default TopNav;

const styles = StyleSheet.create({
    topNavContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    safeArea: {
        backgroundColor: 'transparent',
    },
    topNav: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        paddingTop: Platform.OS === 'android' ? 45 : 12,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        color: colors.text.black,
    },
    placeholder: {
        width: 40,
    }
});