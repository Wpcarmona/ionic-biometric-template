import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router'; 
import { BiometricService } from 'src/utils/biometrics.services';
import { AuthService } from 'src/utils/auth.services';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UserPage implements OnInit {

  email: string = '';
  password: string = '';
  biometricLabel: string = 'Biometric Authentication';
  userId:string | null= '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private biometricService: BiometricService
  ) { 
    this.checkBiometricType();
  }

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    console.log('ID del usuario:', userId);
    this.userId = userId;
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    this.email = user.email.toLowerCase() || 'No email available';
  }

  async checkBiometricType() {
    this.biometricLabel = await this.biometricService.getBiometricLabel();
  }

  async biometric() {
    try {
      // Llamamos a la función para verificar la autenticación biométrica
      const isBiometricVerified = await this.biometricService.performBiometricVerification();

      if (isBiometricVerified) {
        console.log('Autenticación biométrica exitosa.');

        // Verifica que el usuario haya ingresado una contraseña antes de guardar
        if (this.password.trim() === '') {
          console.error('Debe ingresar una contraseña antes de usar la autenticación biométrica.');
          return;
        }

        // Si la biometría es exitosa, guardamos las credenciales del usuario
        await this.biometricService.saveCredentials(this.email, this.password);
        localStorage.setItem('biometricRegistered', 'true');
        console.log('Credenciales guardadas exitosamente.');
      } else {
        console.log('Autenticación biométrica fallida.');
      }
    } catch (error) {
      console.error('Error durante la autenticación biométrica:', error);
    }
  }

}
