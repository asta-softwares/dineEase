import { Ionicons } from "@expo/vector-icons";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from '../styles/colors';
const TopNav = ({ handleGoBack, scrollY }) => {
    const animatedStyle = {
        backgroundColor: scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: ['transparent', colors.background],
            extrapolate: 'clamp'
        })
    };

    const backbuttonStyle = {
        color: scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: ['#FFFFFF', '#000000'],
            extrapolate: 'clamp'
        })
    };
    const titleStyle = {
        opacity: scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
    };

    return (
        <Animated.View style={[styles.topNav, animatedStyle]}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <View>
                    <Animated.Text style={backbuttonStyle}>
                        <Ionicons name="arrow-back" size={24} />
                    </Animated.Text>
                </View>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Animated.Text style={[styles.title, titleStyle]}>The Flavorful Fork</Animated.Text>
            </View>
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
    fontSize: 18,
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
});