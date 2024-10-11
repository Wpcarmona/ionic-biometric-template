// auth.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private serverUrl = 'https://backend-cinema-ldnr.onrender.com/cinema/auth/login'; // URL de tu API

  constructor() {} 

  login(email: string, password: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(this.serverUrl, { email, password });
  
        const { header, body } = response.data;
        if (header[0].error === 'NO ERROR' && header[0].code === 200) {
          const token = header[0].token;
          const user = body[0];
  
          // Almacena el token y los datos del usuario en localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
  
          // Devuelve el uid al resolver la promesa
          resolve(user.uid); 
        } else {
          reject('Error al iniciar sesión');
        }
      } catch (error) {
        reject('El email o la contraseña son incorrectos.');
      }
    });
  }
}  