import { NativeBiometric, BiometryType } from 'capacitor-native-biometric';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class BiometricService {

  async getBiometricLabel(): Promise<string> {
    let biometricLabel: string = 'Biometric Authentication'; // Etiqueta por defecto
    try {
      const isAvailable = await NativeBiometric.isAvailable();
  
      if (!isAvailable.isAvailable) {
        return 'No biometrics available';
      }
      switch (isAvailable.biometryType) {
        case BiometryType.FACE_ID:
          biometricLabel = 'Face ID';
          break;
        case BiometryType.TOUCH_ID:
          biometricLabel = 'Touch ID';
          break;
        case BiometryType.FINGERPRINT:
          biometricLabel = 'Huella';
          break;
        default:
          biometricLabel = 'Biometric Authentication';
          break;
      }
    } catch (error) {
      console.error('Error checking biometrics:', error);
      return 'No biometrics available';
    }
    
    return biometricLabel;
  }

  async performBiometricVerification(): Promise<boolean> {
    const result = await NativeBiometric.isAvailable();

    if (!result.isAvailable) return false;

    const verified = await NativeBiometric.verifyIdentity({
      reason: 'For easy log in',
      title: 'Log in',
      subtitle: 'Authenticate using biometrics',
      description: 'Please authenticate to access your account',
    })
      .then(() => true)
      .catch(() => false);

    return verified;
  }

  async saveCredentials(email: string, password: string) {
    await NativeBiometric.setCredentials({
      username:email,
      password:password,
      server: 'https://backend-cinema-ldnr.onrender.com/cinema/auth/login',
    });
  }

  async deleteCredentials() {
    await NativeBiometric.deleteCredentials({
      server: 'https://backend-cinema-ldnr.onrender.com/cinema/auth/login',
    });
  }

  async getCredentials() {
    const credentials = await NativeBiometric.getCredentials({
      server: 'https://backend-cinema-ldnr.onrender.com/cinema/auth/login',
    });
    return credentials;
  }
}


