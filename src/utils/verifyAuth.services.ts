import { NativeBiometric, BiometryType } from 'capacitor-native-biometric';

export async function getBiometricLabel(): Promise<string> {
  let biometricLabel: string = 'Biometric Authentication'; // Etiqueta por defecto
  try {
    const isAvailable = await NativeBiometric.isAvailable();

    if (!isAvailable.isAvailable) {
      return 'No biometrics available';
    }

    // Comprobar el tipo de biometría usando el tipo de enumeración
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
