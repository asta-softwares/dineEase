import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

const LargeButton = ({ title, price, count, color, textColor, onPress }) => {
    const showOnlyTitle = !price && !count;
    
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: color || colors.primary }]} onPress={onPress}>
            <View style={[
                styles.buttonContent,
                showOnlyTitle && styles.centerContent
            ]}>
                {count !== undefined ? (
                    <View style={styles.buttonCount}>
                        <Text style={[typography.buttonMedium, styles.buttonText, { color: textColor || colors.text.white }]}>{count}</Text>
                    </View>
                ) : showOnlyTitle ? null : (
                    <View style={styles.placeholder} />
                )}
                <Text style={[
                    typography.buttonLarge,
                    styles.buttonText,
                    { color: textColor || colors.text.white },
                    showOnlyTitle ? styles.centeredTitleText : styles.titleText
                ]}>{title}</Text>
                {price !== undefined ? (
                    <Text style={[typography.buttonMedium, styles.buttonText, { color: textColor || colors.text.white }]}>{price}</Text>
                ) : showOnlyTitle ? null : (
                    <View style={styles.placeholder} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 16,
        paddingVertical: 16,
        marginBottom: 10,
        width: '100%',
        height: 60,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        height: '100%',
    },
    centerContent: {
        justifyContent: 'center',
    },
    buttonCount: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 16,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.white,
    },
    titleText: {
        flex: 1,
        textAlign: 'center',
    },
    centeredTitleText: {
        textAlign: 'center',
    },
    placeholder: {
        width: 32,
    },
});

export default LargeButton;