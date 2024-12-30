import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

const LargeButton = ({ 
    title, 
    price, 
    count, 
    color, 
    textColor, 
    onPress, 
    disabled = false,
    loading = false 
}) => {
    const showOnlyTitle = !price && !count;
    
    return (
        <TouchableOpacity 
            style={[
                styles.button, 
                { backgroundColor: color || colors.primary },
                (disabled || loading) && styles.buttonDisabled
            ]} 
            onPress={onPress}
            disabled={disabled || loading}
        >
            <View style={[
                styles.buttonContent,
                showOnlyTitle && styles.centerContent
            ]}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="small" color={textColor || colors.text.white} />
                    </View>
                ) : showOnlyTitle ? (
                    <Text style={[
                        typography.buttonLarge,
                        styles.buttonText,
                        { color: textColor || colors.text.white },
                        styles.centeredTitleText
                    ]}>{title}</Text>
                ) : (
                    <View style={styles.content}>
                        {count !== undefined ? (
                            <View style={styles.buttonCount}>
                                <Text style={[typography.buttonMedium, styles.buttonText, { color: textColor || colors.text.white }]}>{count}</Text>
                            </View>
                        ) : (
                            <View style={styles.placeholder} />
                        )}
                        <Text style={[
                            typography.buttonLarge,
                            styles.buttonText,
                            { color: textColor || colors.text.white },
                            styles.titleText
                        ]}>{title}</Text>
                        {price !== undefined ? (
                            <Text style={[typography.buttonMedium, styles.buttonText, { color: textColor || colors.text.white }]}>{price}</Text>
                        ) : (
                            <View style={styles.placeholder} />
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 16,
        paddingVertical: 16,
        width: '100%',
        height: 60,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    centerContent: {
        justifyContent: 'center',
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
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