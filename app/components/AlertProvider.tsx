import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { CustomAlert, CustomAlertProps } from './CustomAlert';

export interface AlertProviderRef {
  showAlert: (props: Omit<CustomAlertProps, 'visible' | 'onDismiss'>) => void;
  hideAlert: () => void;
}

export const AlertProvider = forwardRef<AlertProviderRef>((_, ref) => {
  const [alertProps, setAlertProps] = useState<CustomAlertProps | null>(null);

  useImperativeHandle(ref, () => ({
    showAlert: (props: Omit<CustomAlertProps, 'visible' | 'onDismiss'>) => {
      setAlertProps({
        ...props,
        visible: true,
        onDismiss: () => setAlertProps(null),
      });
    },
    hideAlert: () => {
      setAlertProps(null);
    },
  }));

  return alertProps ? <CustomAlert {...alertProps} /> : null;
});

AlertProvider.displayName = 'AlertProvider';

// Global alert manager
export class Alert {
  private static providerRef: React.RefObject<AlertProviderRef> | null = null;

  static setProviderRef(ref: React.RefObject<AlertProviderRef | null>) {
    this.providerRef = ref as React.RefObject<AlertProviderRef>;
  }

  static alert(
    title: string,
    message?: string,
    buttons?: {
      text: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }[],
    options?: {
      type?: 'info' | 'success' | 'warning' | 'error';
    }
  ) {
    if (this.providerRef?.current) {
      this.providerRef.current.showAlert({
        title,
        message,
        buttons,
        type: options?.type || 'info',
      });
    }
  }

  static success(title: string, message?: string, onPress?: () => void) {
    this.alert(title, message, [{ text: 'OK', onPress }], { type: 'success' });
  }

  static error(title: string, message?: string, onPress?: () => void) {
    this.alert(title, message, [{ text: 'OK', onPress }], { type: 'error' });
  }

  static warning(title: string, message?: string, onPress?: () => void) {
    this.alert(title, message, [{ text: 'OK', onPress }], { type: 'warning' });
  }

  static confirm(
    title: string,
    message?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) {
    this.alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: onCancel },
      { text: 'OK', onPress: onConfirm },
    ]);
  }
}