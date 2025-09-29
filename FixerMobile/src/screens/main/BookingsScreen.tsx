import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

const BookingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bookings Screen - Coming Soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  text: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.DARK_GRAY,
  },
});

export default BookingsScreen;
