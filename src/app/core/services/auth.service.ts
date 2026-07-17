import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Estado reactivo del rol del usuario
  private userRoleSignal = signal<string | null>(localStorage.getItem('user_role'));

  constructor(private router: Router) {}

  // Exponer el rol como lectura de forma segura
  getRole = computed(() => this.userRoleSignal());

  // Simulación de login (Ajusta la llamada HTTP con tu Backend en el futuro)
  login(username: string, password: string): boolean {
    let role = '';

    // Lógica de simulación de roles para pruebas
    if (username === 'admin' && password === 'admin123') {
      role = 'ADMIN';
    } else if (username === 'epidemio' && password === 'epidemio123') {
      role = 'EPIDEMIOLOGO';
    } else {
      return false; // Autenticación fallida
    }

    // Almacenar el estado del rol
    localStorage.setItem('user_role', role);
    this.userRoleSignal.set(role);
    
    // Redirigir a la pantalla principal
    this.router.navigate(['/']);
    return true;
  }

  logout() {
    localStorage.removeItem('user_role');
    this.userRoleSignal.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.userRoleSignal() !== null;
  }
}