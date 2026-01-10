import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn = signal(false);
  username = signal('');

  login(name: string) {
    this.username.set(name);
    this.isLoggedIn.set(true);
  }

  logout() {
    this.username.set('');
    this.isLoggedIn.set(false);
  }
}