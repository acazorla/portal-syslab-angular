import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  @Output() close = new EventEmitter<void>();

  newPassword = '';
  confirmPassword = '';
  error = '';
  success = '';
  specialRegex = /[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]/;

  hasUppercase(pw: string): boolean {
    return /[A-Z]/.test(pw);
  }

  hasNumber(pw: string): boolean {
    return /\d/.test(pw);
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }

  isValid(): boolean {
    return pwValid(this.newPassword) && this.passwordsMatch();
  }

  onChange(): void {
    this.error = '';
    this.success = '';

    if (!pwValid(this.newPassword)) {
      this.error = 'La nueva contraseña no cumple los requisitos.';
      return;
    }

    if (!this.passwordsMatch()) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    // Simular cambio de contraseña (aquí iría la llamada al backend)
    this.success = 'Contraseña cambiada exitosamente (simulado)';
    setTimeout(() => this.close.emit(), 900);
  }

  onCancel(): void {
    this.close.emit();
  }
}

// helper function fuera de la clase
function pwValid(pw: string): boolean {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]).{8,}$/.test(pw);
}
