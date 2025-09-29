import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Card } from 'react-native-paper';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { AuthStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { verifyOTP, resendOTP, clearError } from '../../store/slices/authSlice';
import { COLORS, FONT_SIZES, SPACING, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';
import { showToast } from '../../store/slices/uiSlice';

type OTPVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputRef = useRef<OTPInputView>(null);

  useEffect(() => {
    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const validateOTP = (otpCode: string) => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return false;
    }
    setOtpError('');
    return true;
  };

  const handleOTPChange = (otpCode: string) => {
    setOtp(otpCode);
    if (otpError) {
      setOtpError('');
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP(otp)) return;

    try {
      const result = await dispatch(verifyOTP({ phone, otp }));
      
      if (verifyOTP.fulfilled.match(result)) {
        dispatch(showToast({
          message: SUCCESS_MESSAGES.OTP_VERIFIED,
          type: 'success',
        }));
        // Navigate to profile setup or main app
        navigation.navigate('ProfileSetup', { userData: result.payload.user });
      } else {
        dispatch(showToast({
          message: result.payload as string || ERROR_MESSAGES.INVALID_OTP,
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

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      const result = await dispatch(resendOTP(phone));
      
      if (resendOTP.fulfilled.match(result)) {
        dispatch(showToast({
          message: SUCCESS_MESSAGES.OTP_SENT,
          type: 'success',
        }));
        setResendTimer(60);
        setCanResend(false);
        setOtp('');
        otpInputRef.current?.clear();
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

  const handleBackToLogin = () => {
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
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Phone</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{'\n'}
            <Text style={styles.phoneNumber}>{phone}</Text>
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Enter Verification Code</Text>
            
            <View style={styles.otpContainer}>
              <OTPInputView
                ref={otpInputRef}
                style={styles.otpInput}
                pinCount={6}
                code={otp}
                onCodeChanged={handleOTPChange}
                autoFocusOnLoad
                codeInputFieldStyle={styles.otpInputField}
                codeInputHighlightStyle={styles.otpInputHighlight}
                onCodeFilled={(code) => {
                  setOtp(code);
                  handleVerifyOTP();
                }}
              />
              {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
            </View>

            <Button
              mode="contained"
              onPress={handleVerifyOTP}
              loading={isLoading}
              disabled={isLoading || otp.length !== 6}
              style={styles.verifyButton}
              contentStyle={styles.buttonContent}
            >
              Verify Code
            </Button>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn't receive the code?{' '}
              </Text>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={!canResend}
                style={styles.resendButton}
              >
                <Text style={[
                  styles.resendButtonText,
                  !canResend && styles.resendButtonTextDisabled
                ]}>
                  {canResend ? 'Resend' : `Resend in ${resendTimer}s`}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Having trouble? Contact support for assistance
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  content: {
    flex: 1,
    padding: SPACING.MD,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
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
    lineHeight: 24,
  },
  phoneNumber: {
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
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
  otpContainer: {
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  otpInput: {
    width: '100%',
    height: 60,
  },
  otpInputField: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: COLORS.GRAY,
    borderRadius: 8,
    backgroundColor: COLORS.WHITE,
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  otpInputHighlight: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: FONT_SIZES.SM,
    marginTop: SPACING.SM,
    textAlign: 'center',
  },
  verifyButton: {
    marginBottom: SPACING.MD,
  },
  buttonContent: {
    paddingVertical: SPACING.SM,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  resendText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.DARK_GRAY,
  },
  resendButton: {
    marginLeft: SPACING.XS,
  },
  resendButtonText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  resendButtonTextDisabled: {
    color: COLORS.GRAY,
  },
  backButton: {
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  backButtonText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.GRAY,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default OTPVerificationScreen;
