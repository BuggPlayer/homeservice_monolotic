import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Avatar, Card, List, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.first_name?.charAt(0) || 'U'}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.email}>{user?.phone}</Text>
        <Text style={styles.userType}>
          {user?.user_type === 'customer' ? 'Customer' : 'Service Provider'}
        </Text>
      </View>

      <Card style={styles.card}>
        <List.Item
          title="Edit Profile"
          description="Update your personal information"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleEditProfile}
        />
        <List.Item
          title="Settings"
          description="App preferences and notifications"
          left={(props) => <List.Icon {...props} icon="cog" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleSettings}
        />
        <List.Item
          title="Help & Support"
          description="Get help and contact support"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="About"
          description="App version and information"
          left={(props) => <List.Icon {...props} icon="information" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
      </Card>

      <Button
        mode="outlined"
        onPress={handleLogout}
        loading={isLoading}
        disabled={isLoading}
        style={styles.logoutButton}
        textColor={COLORS.ERROR}
      >
        Sign Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.LG,
    backgroundColor: COLORS.WHITE,
    marginBottom: SPACING.MD,
  },
  avatar: {
    backgroundColor: COLORS.PRIMARY,
    marginBottom: SPACING.MD,
  },
  name: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: SPACING.XS,
  },
  email: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.DARK_GRAY,
    marginBottom: SPACING.XS,
  },
  userType: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  card: {
    margin: SPACING.MD,
    elevation: 2,
  },
  logoutButton: {
    margin: SPACING.MD,
    borderColor: COLORS.ERROR,
  },
});

export default ProfileScreen;
