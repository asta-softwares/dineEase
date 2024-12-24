import React from 'react';
import { View, StyleSheet, Platform, Keyboard } from 'react-native';
import { colors } from '../../styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Footer = ({ children, keyboardAware = false, style }) => {
    const insets = useSafeAreaInsets();
    const [keyboardVisible, setKeyboardVisible] = React.useState(false);

    React.useEffect(() => {
        if (!keyboardAware) return;

        const keyboardWillShow = Platform.OS === 'ios' 
            ? 'keyboardWillShow' 
            : 'keyboardDidShow';
        const keyboardWillHide = Platform.OS === 'ios' 
            ? 'keyboardWillHide' 
            : 'keyboardDidHide';

        const showSubscription = Keyboard.addListener(keyboardWillShow, () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener(keyboardWillHide, () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [keyboardAware]);

    if (keyboardAware && keyboardVisible && Platform.OS === 'ios') {
        return (
            <View style={[
                styles.footer,
                styles.keyboardFooter,
                { height: 90 },
                style
            ]}>
                {children}
            </View>
        );
    }
    
    return (
        <View style={[
            styles.footer,
            { paddingBottom: Math.max(0, insets.bottom + 4) },
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 0,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    keyboardFooter: {
        paddingBottom: 0,
        shadowOpacity: 0,
        elevation: 0,
    }
});

export default Footer;