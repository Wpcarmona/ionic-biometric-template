import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonLoading } from '@ionic/angular/standalone';
import { NativeBiometric, BiometryType } from 'capacitor-native-biometric';
import { BiometricService } from 'src/utils/biometrics.services';
import { AuthService } from '../../utils/auth.services'
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonLoading, IonInput, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent,FormsModule],
})
export class HomePage implements OnInit{
  biometricLabel: string = 'Biometric Authentication'; // Etiqueta por defecto
  textBiometric:string = '';
  email:string='';
  password:string='';
  isLoading: boolean = false; 
  isBiometricRegistered: boolean = false;

  constructor(
    private authService:AuthService,
    private router:Router,
    private biometricService: BiometricService
  ) {
    this.checkBiometricType(); // Verificar tipo de biometría al iniciar
  }

  ngOnInit() {
    this.checkIfBiometricRegistered(); // Verificar si la biometría está registrada al iniciar
  }
 

  async checkBiometricType() {
    this.biometricLabel = await this.biometricService.getBiometricLabel();
  }

  checkIfBiometricRegistered() {
    // Verifica si hay un indicador en el localStorage
    const biometricRegistered = localStorage.getItem('biometricRegistered');
    this.isBiometricRegistered = biometricRegistered === 'true'; // Actualiza el indicador
  }

  async login() {
    if (this.email === '' || this.password === '') {
      console.log('Las credenciales son necesarias');
      return;
    }
  
    this.isLoading = true;  // Mostrar el loading cuando comience el login
  
    // Llama al método login del authService
    this.authService.login(this.email, this.password)
      .then((uid) => {
        // El login fue exitoso y tenemos el UID
        this.isLoading = false;  // Ocultar el loading cuando termine el login
        console.log('Login exitoso, redirigir a la página principal');
  
        setTimeout(() => {
          // Redirigir usando el uid obtenido del login
          this.router.navigate(['user', uid]);
        }, 300);
      })
      .catch((error) => {
        this.isLoading = false;  // Ocultar el loading en caso de error
        console.error('Error en el login:', error);
        // Muestra un mensaje de error o realiza alguna acción
      });
  }
  

  async authenticateWithBiometrics() {
    try {
      const isAvailable = await NativeBiometric.isAvailable();
      if (!isAvailable.isAvailable) {
        console.log('La autenticación biométrica no está disponible en este dispositivo');
        return;
      }

      await NativeBiometric.verifyIdentity({
        reason: 'Para iniciar sesión fácilmente',
        title: 'Autenticación Biométrica',
        subtitle: 'Autentíquese para continuar',
        description: 'Por favor, autentíquese para acceder a su cuenta',
      });

      this.textBiometric = 'Autenticado!';
      console.log('¡Autenticación exitosa!');

      // Aquí, intenta obtener las credenciales almacenadas
      const credentials = await this.biometricService.getCredentials();

      // Si se obtienen las credenciales, intenta iniciar sesión
      if (credentials) {
        this.email = credentials.username; // Establece el email
        this.password = credentials.password; // Establece la contraseña

        // Realiza el inicio de sesión con las credenciales obtenidas
        this.login();
      } else {
        console.log('No se encontraron credenciales almacenadas.');
      }

    } catch (error) {
      console.log('La autenticación falló o fue cancelada:', error);
    }
  }
}
