import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  type?: 'info' | 'success' | 'warning' | 'error';
  onDismiss?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  type = 'info',
  onDismiss,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          iconName: 'checkmark-circle' as const,
          iconColor: '#10b981',
          accentColor: '#ecfdf5',
        };
      case 'warning':
        return {
          iconName: 'warning' as const,
          iconColor: '#f59e0b',
          accentColor: '#fffbeb',
        };
      case 'error':
        return {
          iconName: 'close-circle' as const,
          iconColor: '#ef4444',
          accentColor: '#fef2f2',
        };
      default:
        return {
          iconName: 'information-circle' as const,
          iconColor: '#0ea5e9',
          accentColor: '#f0f9ff',
        };
    }
  };

  const typeConfig = getTypeConfig();

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const getButtonStyle = (buttonStyle: AlertButton['style']) => {
    switch (buttonStyle) {
      case 'destructive':
        return styles.destructiveButton;
      case 'cancel':
        return styles.cancelButton;
      default:
        return styles.defaultButton;
    }
  };

  const getButtonTextStyle = (buttonStyle: AlertButton['style']) => {
    switch (buttonStyle) {
      case 'destructive':
        return styles.destructiveButtonText;
      case 'cancel':
        return styles.cancelButtonText;
      default:
        return styles.defaultButtonText;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        {Platform.OS === 'ios' ? (
          <View style={[StyleSheet.absoluteFillObject, styles.iosBlur]} />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, styles.androidBlur]} />
        )}
        
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: typeConfig.accentColor,
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: typeConfig.accentColor }]}>
            <Ionicons
              name={typeConfig.iconName}
              size={32}
              color={typeConfig.iconColor}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
          </View>

          <View style={buttons.length > 2 ? styles.buttonContainerVertical : styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  buttons.length > 2 ? styles.buttonVertical : styles.button,
                  getButtonStyle(button.style),
                  buttons.length > 2 && index < buttons.length - 1 && styles.buttonMarginBottom,
                ]}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.8}
              >
                <Text style={getButtonTextStyle(button.style)}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  androidBlur: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  iosBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  alertContainer: {
    width: screenWidth * 0.85,
    maxWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  buttonContainerVertical: {
    flexDirection: 'column',
    width: '100%',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonVertical: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonMarginBottom: {
    marginBottom: 0,
  },
  defaultButton: {
    backgroundColor: '#0ea5e9',
    shadowColor: '#0ea5e9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  destructiveButton: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  defaultButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  destructiveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export class CustomAlertManager {
  private static alertRef: React.RefObject<any> | null = null;
  private static currentAlert: CustomAlertProps | null = null;

  static setRef(ref: React.RefObject<any>) {
    this.alertRef = ref;
  }

  static show(props: Omit<CustomAlertProps, 'visible' | 'onDismiss'>) {
    if (this.alertRef?.current) {
      this.currentAlert = {
        ...props,
        visible: true,
        onDismiss: () => this.hide(),
      };
      this.alertRef.current.showAlert(this.currentAlert);
    }
  }

  static hide() {
    if (this.alertRef?.current) {
      this.alertRef.current.hideAlert();
      this.currentAlert = null;
    }
  }
}