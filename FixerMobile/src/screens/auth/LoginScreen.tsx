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
import { TextInput, Button, Card } from 'react-native-paper';
import PhoneInput from 'react-native-phone-number-input';
import { AuthStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { COLORS, FONT_SIZES, SPACING, VALIDATION_RULES, ERROR_MESSAGES } from '../../constants';
import { showToast } from '../../store/slices/uiSlice';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setPhoneError('');
    setPasswordError('');

    if (!phone.trim()) {
      setPhoneError(ERROR_MESSAGES.REQUIRED_FIELD);
      isValid = false;
    } else if (!VALIDATION_RULES.PHONE.test(phone)) {
      setPhoneError(ERROR_MESSAGES.INVALID_PHONE);
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError(ERROR_MESSAGES.REQUIRED_FIELD);
      isValid = false;
    } else if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      setPasswordError(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const result = await dispatch(loginUser({ phone, password }));
      
      if (loginUser.fulfilled.match(result)) {
        dispatch(showToast({
          message: 'Login successful!',
          type: 'success',
        }));
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

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password
    Alert.alert('Forgot Password', 'This feature will be available soon!');
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
          <Text style={styles.title}>Welcome to Fixer</Text>
          <Text style={styles.subtitle}>Your trusted home services marketplace</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Sign In</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <PhoneInput
                defaultCode="US"
                layout="first"
                onChangeText={setPhone}
                onChangeFormattedText={setPhone}
                withDarkTheme={false}
                withShadow={false}
                autoFocus={false}
                containerStyle={styles.phoneContainer}
                textContainerStyle={styles.phoneTextContainer}
                textInputStyle={styles.phoneInput}
                codeTextStyle={styles.phoneCode}
              />
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                mode="outlined"
                value={password}
                onChangeText={setPassword}
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
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              Sign In
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              onPress={handleRegister}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
            >
              Create New Account
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
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
  errorText: {
    color: COLORS.ERROR,
    fontSize: FONT_SIZES.XS,
    marginTop: SPACING.XS,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.LG,
  },
  forgotPasswordText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
  },
  loginButton: {
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
  registerButton: {
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

export default LoginScreen;
