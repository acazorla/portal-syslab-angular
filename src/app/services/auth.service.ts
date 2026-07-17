import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}
  isLoggedIn = signal(false);
  username = signal('');

  private userRolesSignal = signal<string[]>(
    JSON.parse(localStorage.getItem('user_roles') || '[]')
  );
  // Exponer los estados reactivos
  getUserRoles = computed(() => this.userRolesSignal());
  login(name: string, roles: string[]) {
    this.username.set(name);
    this.isLoggedIn.set(true);
    this.userRolesSignal.set(roles);
  }

/*   logout() {
    this.username.set('');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  } */
  logout() {
    localStorage.removeItem('user_roles');
    //localStorage.removeItem('user_full_name');
    this.userRolesSignal.set([]);
    //this.userNameSignal.set(null);
    this.username.set('');
    this.isLoggedIn.set(false);
    //this.router.navigate(['/login']);
  }
}