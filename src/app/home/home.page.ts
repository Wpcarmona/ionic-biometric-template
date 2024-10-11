import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { NativeBiometric, BiometryType } from 'capacitor-native-biometric';
import { getBiometricLabel } from 'src/utils/verifyAuth.services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonInput, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent,FormsModule],
})
export class HomePage{
  biometricLabel: string = 'Biometric Authentication'; // Etiqueta por defecto
  textBiometric:string = '';
  email:string='';
  password:string='';

  constructor() {
    this.checkBiometricType(); // Verificar tipo de biometría al iniciar
  }
 

  async checkBiometricType() {
    this.biometricLabel = await getBiometricLabel();
  }

  login(){}

  async authenticateWithBiometrics() {
    try {
      const isAvailable = await NativeBiometric.isAvailable();
      if (!isAvailable.isAvailable) {
        console.log('Biometric authentication is not available on this device');
        return;
      }

      await NativeBiometric.verifyIdentity({
        reason: 'For easy log in',
        title: 'Biometric Authentication',
        subtitle: 'Authenticate to proceed',
        description: 'Please authenticate to access your account',
      });

      this.textBiometric = 'autenticado!'

      console.log('Authentication successful!');
    } catch (error) {
      console.log('Authentication failed or was canceled:', error);
    }
  }
}
