import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Base spacing unit
const UNIT = 4;

export const layout = {
  // Screen
  screenWidth: width,
  
  // Spacing
  spacing: {
    xs: UNIT, // 4
    sm: UNIT * 2, // 8
    md: UNIT * 5, // 20
    lg: UNIT * 6, // 24
    xl: UNIT * 8, // 32
    xxl: UNIT * 10, // 40
  },

  // Container
  container: {
    paddingHorizontal: UNIT * 5, // 20
  },

  // Card
  card: {
    borderRadius: UNIT * 2, // 8
    padding: UNIT * 3, // 12
  },

  // Header
  header: {
    height: UNIT * 14, // 56
    paddingTop: UNIT * 2, // 8
  },

  // Calculate responsive horizontal padding
  getResponsiveSpacing: (baseSpacing = UNIT * 5) => {
    const screenPadding = width * 0.05; // 5% of screen width
    return Math.max(baseSpacing, screenPadding);
  },

  // Calculate dynamic width
  getResponsiveWidth: (columns = 1, gap = UNIT * 5) => {
    const totalGap = gap * (columns - 1);
    const containerPadding = UNIT * 5 * 2;
    return (width - totalGap - containerPadding) / columns;
  }
};
