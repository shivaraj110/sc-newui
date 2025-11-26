import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header with Gradient */}
            <LinearGradient
              colors={['#0ea5e9', '#0284c7', '#0369a1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.headerContent}>
                <Text style={styles.welcomeBackText}>Almost There!</Text>
                <Text style={styles.appName}>Email Verification</Text>
                <Text style={styles.headerSubtitle}>We&apos;ve sent you a verification code</Text>
              </View>
            </LinearGradient>

            {/* Form Container */}
            <View style={styles.formContainer}>
              <View style={styles.formCard}>
                <View style={styles.verificationIconContainer}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.verificationIcon}
                  >
                    <Ionicons name="mail" size={32} color="white" />
                  </LinearGradient>
                </View>

                <Text style={styles.signInTitle}>Verify Your Email</Text>
                <Text style={styles.signInSubtitle}>
                  Please enter the 6-digit code sent to{'\n'}{emailAddress}
                </Text>

                {error ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={20} color="#ef4444" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {/* Verification Code Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Verification Code</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="shield-checkmark-outline" size={20} color="#0ea5e9" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="#94a3b8"
                      value={code}
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                  style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                  onPress={onPressVerify}
                  disabled={loading || !code}
                >
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.signInGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Text style={styles.signInButtonText}>Verify Email</Text>
                        <Ionicons name="checkmark" size={20} color="white" />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Resend Code */}
                <TouchableOpacity style={styles.resendContainer}>
                  <Text style={styles.resendText}>Didn&apos;t receive the code? </Text>
                  <Text style={styles.resendLink}>Resend</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#0ea5e9', '#0284c7', '#0369a1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <Text style={styles.welcomeBackText}>Welcome!</Text>
              <Text style={styles.appName}>ShelfCook</Text>
              <Text style={styles.headerSubtitle}>Create your account to get started</Text>
            </View>
          </LinearGradient>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <Text style={styles.signInTitle}>Create Account</Text>
              <Text style={styles.signInSubtitle}>Fill in your details to create a new account</Text>

              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Name Inputs Row */}
              <View style={styles.nameRow}>
                <View style={[styles.inputContainer, styles.nameInput]}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="person-outline" size={20} color="#0ea5e9" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="First name"
                      placeholderTextColor="#94a3b8"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={[styles.inputContainer, styles.nameInput]}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="person-outline" size={20} color="#0ea5e9" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Last name"
                      placeholderTextColor="#94a3b8"
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Ionicons name="mail-outline" size={20} color="#0ea5e9" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#94a3b8"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Ionicons name="lock-closed-outline" size={20} color="#0ea5e9" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms and Privacy */}
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                onPress={onSignUpPress}
                disabled={loading || !emailAddress || !password || !firstName || !lastName}
              >
                <LinearGradient
                  colors={['#0ea5e9', '#0284c7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.signInGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Text style={styles.signInButtonText}>Create Account</Text>
                      <Ionicons name="arrow-forward" size={20} color="white" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={20} color="#4285f4" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={20} color="#000" />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>

              {/* Sign In Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Already have an account? </Text>
                <Link href="./sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signUpLink}>Sign in</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeBackText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    marginTop: -40,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  signInTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  signInSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameInput: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 12,
    margin: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 16,
    paddingRight: 16,
  },
  passwordToggle: {
    padding: 16,
  },
  termsText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  termsLink: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  signInButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 14,
    color: '#64748b',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 14,
    color: '#64748b',
  },
  signUpLink: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  verificationIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  verificationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#64748b',
  },
  resendLink: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '600',
  },
});