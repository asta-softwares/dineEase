import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Animated, { 
    useAnimatedStyle,
    interpolateColor,
    interpolate,
    withTiming,
    useSharedValue,
} from 'react-native-reanimated';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const TopNav = ({ handleGoBack, title = "The Flavorful Fork", scrollY }) => {
    const defaultScrollY = useSharedValue(100);
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

    const backButtonStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(
                animValue.value,
                [0, 100],
                ['#FFFFFF', '#000000']
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
        };
    });

    return (
        <Animated.View style={[styles.topNav, containerStyle]}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Animated.View style={backButtonStyle}>
                    <Ionicons name="arrow-back" size={24} />
                </Animated.View>
            </TouchableOpacity>
            <Animated.View style={[styles.titleContainer, titleStyle]}>
                <Animated.Text style={[typography.h3, styles.title]}>
                    {title}
                </Animated.Text>
            </Animated.View>
            <View style={styles.placeholder} />
        </Animated.View>
    )
}

export default TopNav;

const styles = StyleSheet.create({
    topNav: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingTop: 60,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    backButton: {
        padding: 8,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        color: colors.text.primary,
    },
    placeholder: {
        width: 40,
    }
});