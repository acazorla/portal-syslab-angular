import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Patient {
  id: string;
  nombrePaciente: string;
  fechaAtencion: string;
  examenes: Array<{ nombre: string; rutaExamen: string }>;
}

interface PatientsResponse {
  patients: Patient[];
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients = signal<Patient[]>([]);
  filteredPatients = signal<Patient[]>([]);
  searchTerm = '';
  startDate = '';  // Propiedades de filtro de fecha
  endDate = '';
 
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  private loadPatients(): void {
    this.http.get<PatientsResponse>('assets/data/patients.json').subscribe({
      next: (data) => {
        this.patients.set(data.patients);
        this.filterPatients();
        //this.filteredPatients.set(data.patients);
      },
      error: (err) => console.error('Error cargando pacientes:', err)
    });
  }

  //filterPatients(): void {
  //  const term = this.searchTerm.toLowerCase().trim();
  //  if (!term) {
     // this.filteredPatients.set(this.patients());
    //  return;
    //}

    //this.filteredPatients.set(
    //  this.patients().filter(p =>
    //    p.nombrePaciente.toLowerCase().includes(term) || 
    //    p.id.toLowerCase().includes(term)
   //   )
   // );
  //}
  filterPatients(): void {
    const term = this.searchTerm.toLowerCase().trim();
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    const filtered = this.patients().filter(patient => {
      // Filtro por nombre o ID
      const matchesSearch = !term || 
        patient.nombrePaciente.toLowerCase().includes(term) || 
        patient.id.toLowerCase().includes(term);

      // Filtro por rango de fechas
      const patientDate = new Date(patient.fechaAtencion);
      const matchesDateRange = (!start || patientDate >= start) && 
                               (!end || patientDate <= end);

      return matchesSearch && matchesDateRange;
    });

    this.filteredPatients.set(filtered);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.startDate = '';
    this.endDate = '';
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