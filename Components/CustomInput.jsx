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
  editable = true,
  style,
}) => {
  return (
    <View style={[
      styles.inputContainer,
      !editable && styles.inputContainerDisabled,
      style
    ]}>
      {iconPosition === 'left' && iconName && (
        <Ionicons
          name={iconName}
          size={15}
          color={editable ? colors.secondary : colors.text.disabled}
          style={styles.iconLeft}
        />
      )}
      <TextInput
        style={[
          styles.input,
          typography.bodyMedium,
          !editable && styles.inputDisabled,
          iconPosition === 'left' && styles.inputWithLeftIcon,
          iconPosition === 'right' && styles.inputWithRightIcon,
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
        <Ionicons
          name={iconName}
          size={15}
          color={editable ? colors.secondary : colors.text.disabled}
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
  inputContainerDisabled: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.75,
  },
  inputDisabled: {
    color: colors.text.disabled,
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  inputWithRightIcon: {
    marginRight: 8,
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
