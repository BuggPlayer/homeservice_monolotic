import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

const MessagesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Messages Screen - Coming Soon!</Text>
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

export default MessagesScreen;
