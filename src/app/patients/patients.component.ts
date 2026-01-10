import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangePasswordComponent } from '../change-password/change-password.component';

interface Patient {
  id: string;
  nombrePaciente: string;
  examenes: Array<{ nombre: string; rutaExamen: string }>;
}

interface PatientsResponse {
  patients: Patient[];
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, ChangePasswordComponent],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients = signal<Patient[]>([]);
  filteredPatients = signal<Patient[]>([]);
  searchTerm = '';
  showChangePassword = signal(false);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  private loadPatients(): void {
    this.http.get<PatientsResponse>('assets/data/patients.json').subscribe({
      next: (data) => {
        this.patients.set(data.patients);
        this.filteredPatients.set(data.patients);
      },
      error: (err) => console.error('Error cargando pacientes:', err)
    });
  }

  filterPatients(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredPatients.set(this.patients());
      return;
    }

    this.filteredPatients.set(
      this.patients().filter(p =>
        p.nombrePaciente.toLowerCase().includes(term) || 
        p.id.toLowerCase().includes(term)
      )
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterPatients();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}