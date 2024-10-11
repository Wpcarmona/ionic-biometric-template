// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Asegúrate de tener importado HttpClient
import { NativeBiometric } from 'capacitor-native-biometric';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private serverUrl = 'https://backend-cinema-ldnr.onrender.com/api/auth/login'; // URL de tu API

  constructor(private http: HttpClient) {} // Inyectar HttpClient

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
      server: this.serverUrl,
    });
  }

  async deleteCredentials(server:string) {
    await NativeBiometric.deleteCredentials({
      server: this.serverUrl,
    });
  }

  async getCredentials(server:string) {
    const credentials = await NativeBiometric.getCredentials({
      server: this.serverUrl,
    });
    return credentials;
  }

  // Método para iniciar sesión a través de la API
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.serverUrl, { email, password });
  }
}
