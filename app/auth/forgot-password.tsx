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
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();
  
  const [emailAddress, setEmailAddress] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');

  const onSendResetCode = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });

      setStep('verify');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyCode = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
      });

      if (result.status === 'needs_new_password') {
        setStep('reset');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      await signIn.resetPassword({
        password: newPassword,
      });

      router.push('./sign-in');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={['#f97316', '#ea580c']}
          style={styles.icon}
        >
          <Ionicons name="mail" size={32} color="white" />
        </LinearGradient>
      </View>

      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        No worries! Enter your email address and we&apos;ll send you a reset code.
      </Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

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

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
        onPress={onSendResetCode}
        disabled={loading || !emailAddress}
      >
        <LinearGradient
          colors={['#f97316', '#ea580c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryGradient}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Send Reset Code</Text>
              <Ionicons name="send" size={20} color="white" />
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  const renderVerifyStep = () => (
    <>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={['#a855f7', '#9333ea']}
          style={styles.icon}
        >
          <Ionicons name="shield-checkmark" size={32} color="white" />
        </LinearGradient>
      </View>

      <Text style={styles.title}>Check Your Email</Text>
      <Text style={styles.subtitle}>
        We&apos;ve sent a 6-digit reset code to{'\n'}{emailAddress}
      </Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Reset Code</Text>
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

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
        onPress={onVerifyCode}
        disabled={loading || !code}
      >
        <LinearGradient
          colors={['#a855f7', '#9333ea']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryGradient}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Verify Code</Text>
              <Ionicons name="checkmark" size={20} color="white" />
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn&apos;t receive the code? </Text>
        <Text style={styles.resendLink}>Resend</Text>
      </TouchableOpacity>
    </>
  );

  const renderResetStep = () => (
    <>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.icon}
        >
          <Ionicons name="lock-closed" size={32} color="white" />
        </LinearGradient>
      </View>

      <Text style={styles.title}>Create New Password</Text>
      <Text style={styles.subtitle}>
        Enter a new password for your account. Make sure it&apos;s strong and secure.
      </Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>New Password</Text>
        <View style={styles.inputWrapper}>
          <View style={styles.inputIcon}>
            <Ionicons name="lock-closed-outline" size={20} color="#0ea5e9" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#94a3b8"
            value={newPassword}
            onChangeText={setNewPassword}
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

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
        onPress={onResetPassword}
        disabled={loading || !newPassword}
      >
        <LinearGradient
          colors={['#10b981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryGradient}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Reset Password</Text>
              <Ionicons name="checkmark" size={20} color="white" />
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

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
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.appName}>ShelfCook</Text>
              <View style={{ width: 40 }} />
            </View>
          </LinearGradient>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              {step === 'email' && renderEmailStep()}
              {step === 'verify' && renderVerifyStep()}
              {step === 'reset' && renderResetStep()}

              {/* Back to Sign In */}
              <View style={styles.backToSignInContainer}>
                <Text style={styles.backToSignInText}>Remember your password? </Text>
                <Link href="./sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={styles.backToSignInLink}>Sign in</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
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
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  backToSignInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  backToSignInText: {
    fontSize: 14,
    color: '#64748b',
  },
  backToSignInLink: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '600',
  },
});