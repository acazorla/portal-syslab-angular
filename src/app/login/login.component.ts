import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

interface UsersResponse { users: Array<{ userName: string; name: string; password: string }>; }

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  name = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private nav: NavigationService
  ) {}

  async onSubmit() {
    this.error = '';
    this.isLoading = true;

    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Usuario y contraseña son requeridos';
      this.isLoading = false;
      return;
    }

    try {
      const data = await firstValueFrom(this.http.get<UsersResponse>('assets/data/users.json'));
      const user = data?.users?.find((u) => u.userName === this.username);

      if (user) {
        const hashedInput = await this.hashPassword(this.password);
        if (hashedInput === user.password) {
          this.auth.login(user.name);
          this.nav.navigate('patients');
        } else {
          this.error = 'Usuario o contraseña incorrectos';
        }
      } else {
        this.error = 'Usuario o contraseña incorrectos';
      }
    } catch (err: unknown) {
      if (err instanceof HttpErrorResponse && err.status === 404) {
        this.error = 'Archivo de usuarios no encontrado';
      } else {
        this.error = 'Error al verificar credenciales';
      }
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('');
  }
}