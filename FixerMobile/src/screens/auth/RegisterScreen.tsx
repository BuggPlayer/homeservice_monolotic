import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput, Button, Card, RadioButton } from 'react-native-paper';
import PhoneInput from 'react-native-phone-number-input';
import { AuthStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { COLORS, FONT_SIZES, SPACING, VALIDATION_RULES, ERROR_MESSAGES } from '../../constants';
import { showToast } from '../../store/slices/uiSlice';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    user_type: 'customer' as 'customer' | 'provider',
    first_name: '',
    last_name: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!VALIDATION_RULES.PHONE.test(formData.phone)) {
      newErrors.phone = ERROR_MESSAGES.INVALID_PHONE;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
    }

    // Name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.first_name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.last_name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const result = await dispatch(registerUser(formData));
      
      if (registerUser.fulfilled.match(result)) {
        dispatch(showToast({
          message: 'Registration successful!',
          type: 'success',
        }));
        // Navigate to OTP verification
        navigation.navigate('OTPVerification', { phone: formData.phone });
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

  const handleLogin = () => {
    navigation.navigate('Login');
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
          <Text style={styles.title}>Join Fixer</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Create Account</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <PhoneInput
                defaultCode="US"
                layout="first"
                onChangeText={(text) => handleInputChange('phone', text)}
                onChangeFormattedText={(text) => handleInputChange('phone', text)}
                withDarkTheme={false}
                withShadow={false}
                autoFocus={false}
                containerStyle={styles.phoneContainer}
                textContainerStyle={styles.phoneTextContainer}
                textInputStyle={styles.phoneInput}
                codeTextStyle={styles.phoneCode}
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>

            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.SM }]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  mode="outlined"
                  value={formData.first_name}
                  onChangeText={(text) => handleInputChange('first_name', text)}
                  placeholder="Enter first name"
                  style={styles.input}
                />
                {errors.first_name ? <Text style={styles.errorText}>{errors.first_name}</Text> : null}
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: SPACING.SM }]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  mode="outlined"
                  value={formData.last_name}
                  onChangeText={(text) => handleInputChange('last_name', text)}
                  placeholder="Enter last name"
                  style={styles.input}
                />
                {errors.last_name ? <Text style={styles.errorText}>{errors.last_name}</Text> : null}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Account Type</Text>
              <View style={styles.radioContainer}>
                <View style={styles.radioItem}>
                  <RadioButton
                    value="customer"
                    status={formData.user_type === 'customer' ? 'checked' : 'unchecked'}
                    onPress={() => handleInputChange('user_type', 'customer')}
                    color={COLORS.PRIMARY}
                  />
                  <Text style={styles.radioLabel}>Customer</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton
                    value="provider"
                    status={formData.user_type === 'provider' ? 'checked' : 'unchecked'}
                    onPress={() => handleInputChange('user_type', 'provider')}
                    color={COLORS.PRIMARY}
                  />
                  <Text style={styles.radioLabel}>Service Provider</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                mode="outlined"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                mode="outlined"
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm your password"
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
            >
              Create Account
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              onPress={handleLogin}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              Already have an account? Sign In
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
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
  cardTitle: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: SPACING.LG,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.MD,
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: SPACING.MD,
  },
  label: {
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
    color: COLORS.BLACK,
    marginBottom: SPACING.XS,
  },
  phoneContainer: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: 8,
    backgroundColor: COLORS.WHITE,
  },
  phoneTextContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
  },
  phoneInput: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.BLACK,
  },
  phoneCode: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.BLACK,
  },
  input: {
    backgroundColor: COLORS.WHITE,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.SM,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.BLACK,
    marginLeft: SPACING.XS,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: FONT_SIZES.XS,
    marginTop: SPACING.XS,
  },
  registerButton: {
    marginBottom: SPACING.MD,
  },
  buttonContent: {
    paddingVertical: SPACING.SM,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.MD,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.GRAY,
  },
  dividerText: {
    marginHorizontal: SPACING.MD,
    color: COLORS.GRAY,
    fontSize: FONT_SIZES.SM,
  },
  loginButton: {
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

export default RegisterScreen;
