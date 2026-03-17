import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent {
  tipoDocumento = '';
  numeroDocumento = '';
  nombre = '';
  id = '';
  mensaje = '';

  submit() {
    if (!this.nombre.trim() || !this.id.trim() || !this.tipoDocumento.trim() || !this.numeroDocumento.trim()) {
      this.mensaje = 'Todos los campos son requeridos';
      return;
    }
    // Aquí podrías llamar a un servicio para persistir.
    this.mensaje = 'Paciente registrado (simulado)';
    this.nombre = '';
    this.id = '';
    this.tipoDocumento = '';
    this.numeroDocumento = '';
  }
}