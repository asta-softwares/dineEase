import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { layout } from '../constants/layout';

const Badge = ({ text, type = 'pending', icon, style }) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'pending':
        return {
          backgroundColor: colors.warning.light,
          color: colors.warning.dark,
          icon: icon || 'time-outline',
        };
      case 'confirmed':
        return {
          backgroundColor: colors.info.light,
          color: colors.info.dark,
          icon: icon || 'checkmark-circle-outline',
        };
      case 'preparing':
        return {
          backgroundColor: '#FFF8E1', // Light amber
          color: '#FF8F00', // Dark amber
          icon: icon || 'restaurant-outline',
        };
      case 'delivered':
        return {
          backgroundColor: colors.success.light,
          color: colors.success.dark,
          icon: icon || 'checkmark-done-circle',
        };
      case 'cancelled':
        return {
          backgroundColor: colors.error.light,
          color: colors.error.dark,
          icon: icon || 'close-circle',
        };
      case 'rejected':
        return {
          backgroundColor: '#FFCDD2', // Light red
          color: '#B71C1C', // Dark red
          icon: icon || 'ban-outline',
        };
      default:
        return {
          backgroundColor: colors.warning.light,
          color: colors.warning.dark,
          icon: 'time-outline',
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: badgeStyle.backgroundColor }, style]}>
      <Ionicons 
        name={badgeStyle.icon} 
        size={layout.icon.sm} 
        color={badgeStyle.color} 
        style={styles.icon} 
      />
      <Text style={[styles.text, { color: badgeStyle.color }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.xs + 2,
    paddingHorizontal: layout.spacing.sm + 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: layout.spacing.xs,
  },
  text: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
});

export default Badge;
