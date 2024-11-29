import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  iconName,
  iconPosition = 'right',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      {iconPosition === 'left' && iconName && (
        <Ionicons
          name={iconName}
          size={15}
          color={colors.secondary}
          style={styles.iconLeft}
        />
      )}
      <TextInput
        style={[
          styles.input,
          typography.bodyMedium,
          iconPosition === 'left' && { paddingLeft: 35 },
          iconPosition === 'right' && { paddingRight: 35 },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {iconPosition === 'right' && iconName && (
        <Ionicons
          name={iconName}
          size={15}
          color={colors.secondary}
          style={styles.iconRight}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 12,
    backgroundColor: colors.light,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.75,
  },
  iconLeft: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  iconRight: {
    marginRight: 10,
  },
});

export default CustomInput;
