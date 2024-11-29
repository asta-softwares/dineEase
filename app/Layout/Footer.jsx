import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

const Footer = ({ children }) => {
    return (
        <View style={styles.footer}>
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
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
});

export default Footer;