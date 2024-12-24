import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { layout } from '../styles/layout';

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  iconName,
  iconPosition = 'right',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  style,
}) => {
  const iconPadding = 48; // Increased from 40 to add more space

  return (
    <View style={[
      styles.inputContainer,
      !editable && styles.inputContainerDisabled,
      style
    ]}>
      {iconPosition === 'left' && iconName && (
        <View style={styles.iconLeftContainer}>
          <Ionicons
            name={iconName}
            size={20}
            color={editable ? colors.secondary : colors.text.disabled}
          />
        </View>
      )}
      <TextInput
        style={[
          styles.input,
          typography.bodyMedium,
          !editable && styles.inputDisabled,
          iconPosition === 'left' && { paddingLeft: iconPadding },
          iconPosition === 'right' && { paddingRight: iconPadding },
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={editable ? colors.text.secondary : colors.text.disabled}
        editable={editable}
      />
      {iconPosition === 'right' && iconName && (
        <View style={styles.iconRightContainer}>
          <Ionicons
            name={iconName}
            size={20}
            color={editable ? colors.secondary : colors.text.disabled}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  inputContainerDisabled: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: layout.spacing.lg,
    color: colors.text.primary,
  },
  inputDisabled: {
    color: colors.text.disabled,
  },
  iconLeftContainer: {
    position: 'absolute',
    left: layout.spacing.lg,
    height: '100%',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconRightContainer: {
    position: 'absolute',
    right: layout.spacing.lg,
    height: '100%',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default CustomInput;
