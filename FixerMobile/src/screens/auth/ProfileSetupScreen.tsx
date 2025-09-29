import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput, Button, Card } from 'react-native-paper';
import { AuthStackParamList, User } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { updateProfile, clearError } from '../../store/slices/authSlice';
import { COLORS, FONT_SIZES, SPACING, VALIDATION_RULES, ERROR_MESSAGES } from '../../constants';
import { showToast } from '../../store/slices/uiSlice';

type ProfileSetupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ProfileSetup'>;
type ProfileSetupScreenRouteProp = RouteProp<AuthStackParamList, 'ProfileSetup'>;

const ProfileSetupScreen: React.FC = () => {
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const route = useRoute<ProfileSetupScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const { userData } = route.params;
  const [profileData, setProfileData] = useState({
    first_name: userData?.first_name || '',
    last_name: userData?.last_name || '',
    email: '',
    bio: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.first_name.trim()) {
      newErrors.first_name = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (profileData.first_name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    if (!profileData.last_name.trim()) {
      newErrors.last_name = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (profileData.last_name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleComplete = async () => {
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateProfile(profileData));
      
      if (updateProfile.fulfilled.match(result)) {
        dispatch(showToast({
          message: 'Profile setup completed!',
          type: 'success',
        }));
        // Profile setup is complete, user is now authenticated
      } else {
        dispatch(showToast({
          message: result.payload as string || ERROR_MESSAGES.GENERIC_ERROR,
          type: 'error',
        }));
      }
    } catch (error) {
      dispatch(showToast({
        message: ERROR_MESSAGES.GENERIC_ERROR,
        type: 'error',
      }));
    }
  };

  const handleSkip = () => {
    // Skip profile setup and go to main app
    dispatch(showToast({
      message: 'Profile setup skipped. You can complete it later.',
      type: 'info',
    }));
  };

  React.useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Help us personalize your experience</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                mode="outlined"
                value={profileData.first_name}
                onChangeText={(text) => handleInputChange('first_name', text)}
                placeholder="Enter your first name"
                style={styles.input}
              />
              {errors.first_name ? <Text style={styles.errorText}>{errors.first_name}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                mode="outlined"
                value={profileData.last_name}
                onChangeText={(text) => handleInputChange('last_name', text)}
                placeholder="Enter your last name"
                style={styles.input}
              />
              {errors.last_name ? <Text style={styles.errorText}>{errors.last_name}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email (Optional)</Text>
              <TextInput
                mode="outlined"
                value={profileData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio (Optional)</Text>
              <TextInput
                mode="outlined"
                value={profileData.bio}
                onChangeText={(text) => handleInputChange('bio', text)}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            </View>

            <Button
              mode="contained"
              onPress={handleComplete}
              loading={isLoading}
              disabled={isLoading}
              style={styles.completeButton}
              contentStyle={styles.buttonContent}
            >
              Complete Setup
            </Button>

            <Button
              mode="outlined"
              onPress={handleSkip}
              style={styles.skipButton}
              contentStyle={styles.buttonContent}
            >
              Skip for Now
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can update your profile anytime in settings
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.MD,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.XXL,
    marginBottom: SPACING.XL,
  },
  title: {
    fontSize: FONT_SIZES.XXXL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.DARK_GRAY,
    textAlign: 'center',
  },
  card: {
    elevation: 4,
    marginBottom: SPACING.LG,
  },
  inputContainer: {
    marginBottom: SPACING.MD,
  },
  label: {
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
    color: COLORS.BLACK,
    marginBottom: SPACING.XS,
  },
  input: {
    backgroundColor: COLORS.WHITE,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: FONT_SIZES.XS,
    marginTop: SPACING.XS,
  },
  completeButton: {
    marginBottom: SPACING.MD,
  },
  buttonContent: {
    paddingVertical: SPACING.SM,
  },
  skipButton: {
    marginBottom: SPACING.MD,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.LG,
  },
  footerText: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.GRAY,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ProfileSetupScreen;
