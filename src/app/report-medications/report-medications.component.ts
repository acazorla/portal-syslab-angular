/* import { Component, computed, inject, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { BaseChartDirective } from 'ng2-charts';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chart, registerables } from 'chart.js';

import { IngresosService } from '../services/ingresos.service';
import { IngresosDomainService } from '../core/domain/ingresos.mapper';
import { HttpClient } from '@angular/common/http';

Chart.register(...registerables);

@Component({
  selector: 'app-report-attentions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-attentions.component.html',
  styleUrls: ['./report-attentions.component.css']
})
export class ReportAttentionsComponent {

  private readonly ingresosService = inject(IngresosService);
 // --- LÓGICA DE INICIALIZACIÓN ---
  startDate = ''; 
  ngOnInit() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);
    // Formato YYYY-MM-DD requerido por input type="date"
    this.startDate = yesterday.toISOString().split('T')[0];
  }
    // --- CARGA DE DATOS DESDE EL API ---
  loadEpidemiologicalAttentions() {
    // this.http.get<ApiResponse<AdministrativeDivision>>('/api/v1/epidemiological-attentions/search')
    //   .subscribe({
    //     next: (res) => {
    //       if (res.success) {
    //         this.countries.set(res.data);
    //         const peru = res.data.find(c => c.isoCode === 'PE');
    //         if (peru) this.selectCountry(peru.divisionId);
    //       }
    //     },
    //     error: (err) => this.handleApiError(err)
    //   });

      // this.http.post(`/api/v1/epidemiological-attentions/search`, payload)
      // .pipe(finalize(() => this.isSubmitting = false))
      // .subscribe({
      //   next: (res: any) => {
      //     const data = res.data[0];

      //   },
      //   error: (err) => this.handleApiError(err)
      // });

  }
  // 1. Datos brutos desde el servicio
  private readonly ingresosRaw = toSignal(this.ingresosService.getIngresos(), { initialValue: [] });

  // 2. Datos procesados por el Dominio (Capa de Negocio)
  readonly datos = computed(() => IngresosDomainService.calcularMargenes(this.ingresosRaw()));



  filterAttentions(): void {
   
    const start = this.startDate ? new Date(this.startDate) : null;
  }
  // 4. Método que el HTML necesita para la tabla
  getNombreMes(mes: number): string {
    const fecha = new Date(2024, mes - 1, 1);
    const nombre = fecha.toLocaleString('es-ES', { month: 'long' });
    return nombre.charAt(0).toUpperCase() + nombre.slice(1); // Capitalizar
  }

  descargarReporte(): void {
    const datosActuales = this.datos();
 
    if (!datosActuales.length) return;
       const encabezados = ['Periodo', 'Trimestre', 'Mes', 'Ingresos', 'Costos', 'Utilidad', 'Margen %'];
    const filas = datosActuales.map(d => [
      d.periodo,
      d.trimestre,
      this.getNombreMes(d.mes),
      d.ingresos.toFixed(2),
      d.costos.toFixed(2),
      d.ingresoNeto.toFixed(2),
      (d.margenOperativo * 100).toFixed(2)
    ].join(',')); 


  }
  exportToPdf() {
    window.print();
  }
} */




/* import { Component, inject, signal,computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Interfaces fuertemente tipadas según el contrato de tu Microservicio
export interface ApiResponse {
  success: boolean;
  data: EpidemiologicalAttention[];
  meta: ApiMeta;
}

export interface EpidemiologicalAttention {
  consultationDate: string;
  codeOA: string;
  medicalRecordCode: string;
  patientName: string;
  identityDocument: string;
  age: number;
  sex: string;
  diagnosisCode: string;
  diagnosisDescription: string;
  doctorName: string;
  specialtyDescription: string;
  diagnosisType: string;
  careType: string;
  birthDate: string;
}

export interface ApiMeta {
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-report-attentions',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './report-attentions.component.html',
  styleUrls: ['./report-attentions.component.css']
})
export class ReportAttentionsComponent {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/epidemiological-attentions/search';

  filterStartDate = signal<string>('2025-09-15');
  filterEndDate = signal<string>('2025-09-15');


  // Estado reactivo
  allAttentions = signal<EpidemiologicalAttention[]>([]); //  Guardamos los 3161 aquí
  isLoading = signal<boolean>(false);
  hasSearched = signal<boolean>(false);

  //  NUEVO: Control de paginación en Frontend
  currentPage = signal<number>(1);
  pageSize = signal<number>(30); // Muestra de 50 en 50

  //  NUEVO: Signal computado que corta el arreglo automáticamente
  attentions = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.allAttentions().slice(startIndex, endIndex);
  });
// NUEVO Signal de Calculo : Calcula dinámicamente el último elemento visible de la página actual
endRecordIndex = computed(() => {
  const currentMax = this.currentPage() * this.pageSize();
  return Math.min(currentMax, this.totalElements());
});
  // Total de elementos real
  totalElements = computed(() => this.allAttentions().length);
  
  // Total de páginas
  totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize()));

  searchAttentions(): void {
    this.isLoading.set(true);
    this.hasSearched.set(true);
    this.currentPage.set(1); // Resetear a la primera página en cada búsqueda

    const requestBody = {
      startDate: this.filterStartDate(),
      endDate: this.filterEndDate()
    };

    this.http.post<ApiResponse>(this.apiUrl, requestBody).subscribe({
      next: (response) => {
        if (response.success) {
          // Guardamos la masa completa de datos
          this.allAttentions.set(response.data); 
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error: Epidemiological data:', error);
        this.allAttentions.set([]);
        this.isLoading.set(false);
      }
    });
  }

  // Métodos de navegación
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
  //  Función Helper para transformar 'YYYY-MM-DD...' a 'dd/mm/yyyy'
private formatToLatinDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  // 1. Extraer solo la parte de la fecha (ignorar la hora después de la T)
  const onlyDate = dateStr.split('T')[0]; // "2025-09-15"
  // 2. Dividir por el guion
  const parts = onlyDate.split('-'); // ["2025", "09", "15"]
  // 3. Si no tiene el formato esperado de 3 partes, devolver el original por seguridad
  if (parts.length !== 3) return dateStr;
  // 4. Reordenar a dd/mm/yyyy
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`; // "15/09/2025"
}
  descargarReporte(): void {
    const datosActuales = this.allAttentions();
    if (!datosActuales.length) {
      alert('No hay datos disponibles para exportar.');
      return;
    }
// 1. Definir los encabezados en el orden exacto de las columnas
  const encabezados = [
    'Fecha_Consulta',
    'Codigo_OA', 
    'Historia_Clinica', 
    'Paciente', 
    'Documento_de_Identidad', 
    'Edad', 
    'Sexo', 
    'Codigo_Diagnostico', 
    'Descripcion_Diagnostico', 
    'Medico', 
    'Especialidad', 
    'Tipo_de_Diagnostico', 
    'Tipo_de_Atencion', 
    'Fecha_de_Nacimiento'
  ];

  // 2. Procesar las filas limpiando comas internas y espacios para no romper el CSV
  const filas = datosActuales.map(d => {
    return [
      this.formatToLatinDate(d.consultationDate) || '',
      d.codeOA || '',
      d.medicalRecordCode || '',
      `"${(d.patientName || '').trim()}"`,       // Entre comillas por si tiene comas
      d.identityDocument ? `"${d.identityDocument.trim()}"` : '', // Limpia espacios en blanco del backend
      d.age ?? '',
      d.sex || '',
      d.diagnosisCode ? `"${d.diagnosisCode.trim()}"` : '',
      `"${(d.diagnosisDescription || '').trim()}"`,
      `"${(d.doctorName || '').trim()}"`,
      `"${(d.specialtyDescription || '').trim()}"`,
      d.diagnosisType || '',
      d.careType || '',
      this.formatToLatinDate(d.birthDate) || ''
    ].join(','); // Usamos punto y coma (;) porque Excel en español lo lee directamente como columnas
  });
// 3. Unir encabezados y filas con saltos de línea
  const contenidoCsv = [encabezados.join(','), ...filas].join('\n');

  // 4. Agregar el BOM UTF-8 (\uFEFF) para que Excel reconozca tildes, eñes y caracteres especiales en español
  const blob = new Blob(['\uFEFF' + contenidoCsv], { type: 'text/csv;charset=utf-8;' });
  
  // 5. Crear el enlace invisible de descarga en el navegador
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Asignar nombre dinámico basado en las fechas del filtro si deseas
  link.setAttribute('href', url);
  link.setAttribute('download', `Reporte_Epidemiologico_${this.filterStartDate()}_al_${this.filterEndDate()}.csv`);
  link.style.visibility = 'hidden';
  
  // 6. Añadir al DOM, ejecutar la descarga y removerlo
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Liberar memoria del navegador

  }
}
 */
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface ApiResponse {
  success: boolean;
  data: EpidemiologicalAttention[];
  meta: ApiMeta;
}

export interface EpidemiologicalAttention {
  consultationDate: string;
  codeOA: string;
  medicalRecordCode: string;
  patientName: string;
  identityDocument: string;
  age: number;
  sex: string;
  diagnosisCode: string;
  diagnosisDescription: string;
  doctorName: string;
  specialtyDescription: string;
  diagnosisType: string;
  careType: string;
  birthDate: string;
}

export interface ApiMeta {
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-report-medications',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './report-medications.component.html',
  styleUrls: ['./report-medications.component.css']
})
export class ReportMedicationsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/epidemiological-medications/search';

  // Signals para las fechas de filtrado
  filterStartDate = signal<string>('');
  filterEndDate = signal<string>('');
  
  // Bloqueo de calendario nativo para el atributo [max]
  maxTodayDate = signal<string>('');

  // Estado reactivo
  allAttentions = signal<EpidemiologicalAttention[]>([]);
  isLoading = signal<boolean>(false);
  hasSearched = signal<boolean>(false);

  // Control de paginación en Frontend
  currentPage = signal<number>(1);
  pageSize = signal<number>(30);

  ngOnInit(): void {
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    const stringAyer = this.formatDateToYYYYMMDD(ayer);
    const stringHoy = this.formatDateToYYYYMMDD(hoy);

    // Por defecto: ayer
    this.filterStartDate.set(stringAyer);
    this.filterEndDate.set(stringAyer);
    
    // Máximo permitido: hoy
    this.maxTodayDate.set(stringHoy);
  }

  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Validación robusta y limpia libre de desajustes horarios
  validateDateRange(): boolean {
    const desdeStr = this.filterStartDate();
    const hastaStr = this.filterEndDate();

    if (!desdeStr || !hastaStr) return false;

    // Convertir de formato YYYY-MM-DD a timestamp de medianoche local
    const inicioTime = new Date(desdeStr + 'T00:00:00').getTime();
    const finTime = new Date(hastaStr + 'T00:00:00').getTime();
    
    const hoyStr = this.maxTodayDate();
    const hoyTime = new Date(hoyStr + 'T23:59:59').getTime();

    // 1. Validar que no seleccionen fechas posteriores al día de hoy
    if (inicioTime > hoyTime || finTime > hoyTime) {
      alert('No es posible seleccionar fechas posteriores al día de hoy.');
      this.resetToDefaultDates();
      return false;
    }

    // 2. Validar que la fecha inicial no sea mayor que la final
    if (inicioTime > finTime) {
      alert('La fecha de inicio ("Desde") no puede ser mayor que la fecha final ("Hasta").');
      this.filterEndDate.set(desdeStr); // Sincroniza "Hasta" con "Desde" automáticamente
      return false;
    }

    // 3. Calcular la diferencia en días calendario
    const diferenciaMilisegundos = finTime - inicioTime;
    const diferenciaDias = Math.round(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) + 1;

    // Restricción a un rango máximo de una semana (7 días)
    // if (diferenciaDias > 7) {
    //   alert('El rango máximo permitido de consulta es de una semana (7 días).');
    //   this.resetToDefaultDates();
    //   return false;
    // }
if (diferenciaDias > 7) {
  setTimeout(() => {
  alert('El rango máximo permitido de consulta es de una semana (7 días). Se ajustará automáticamente.');

  // 1. Obtener la fecha inicial seleccionada por el usuario
  const [startYear, startMonth, startDay] = this.filterStartDate().split('-').map(Number);
  const nuevaFechaFin = new Date(startYear, startMonth - 1, startDay);
  
  // 2. Sumar 6 días a la fecha inicial para completar un rango de 7 días exactos (ej: Lunes + 6 días = Domingo)
  nuevaFechaFin.setDate(nuevaFechaFin.getDate() + 6);
  const nuevaFechaFinStr = this.formatDateToYYYYMMDD(nuevaFechaFin);

  // 3. Obtener la fecha de hoy como límite máximo permitido
  const hoyStr = this.maxTodayDate();

  // 4. Si la nueva fecha fin excede hoy, la limitamos al día actual; de lo contrario, aplicamos los 7 días
  if (nuevaFechaFinStr > hoyStr) {
    this.filterEndDate.set(hoyStr);
  } else {
    this.filterEndDate.set(nuevaFechaFinStr);
  }
}, 0);
  // Opcional: Si deseas que la consulta proceda inmediatamente tras el ajuste, cambia a 'return true'
  return false; 
}
    return true;
  }

  private resetToDefaultDates(): void {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const stringAyer = this.formatDateToYYYYMMDD(ayer);
    this.filterStartDate.set(stringAyer);
    this.filterEndDate.set(stringAyer);
  }

  // Signal computado para cortar la paginación local
  attentions = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.allAttentions().slice(startIndex, endIndex);
  });

  endRecordIndex = computed(() => {
    const currentMax = this.currentPage() * this.pageSize();
    return Math.min(currentMax, this.totalElements());
  });

  totalElements = computed(() => this.allAttentions().length);
  totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize()));

  searchAttentions(): void {
    // Verificar las fechas reales del Signal justo antes del envío
    if (!this.validateDateRange()) {
      return;
    }

    this.isLoading.set(true);
    this.hasSearched.set(true);
    this.currentPage.set(1);

    const requestBody = {
      startDate: this.filterStartDate(),
      endDate: this.filterEndDate()
    };

    this.http.post<ApiResponse>(this.apiUrl, requestBody).subscribe({
      next: (response) => {
        if (response.success) {
          this.allAttentions.set(response.data); 
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.allAttentions.set([]);
        this.isLoading.set(false);
      }
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  private formatToLatinDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const onlyDate = dateStr.split('T')[0];
    const parts = onlyDate.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  descargarReporte(): void {
    const datosActuales = this.allAttentions();
    if (!datosActuales.length) {
      alert('No hay datos disponibles para exportar.');
      return;
    }

    const encabezados = [
      'Fecha_Consulta', 'Codigo_OA', 'Historia_Clinica', 'Paciente', 
      'Documento_de_Identidad', 'Edad', 'Sexo', 'Codigo_Diagnostico', 
      'Descripcion_Diagnostico', 'Medico', 'Especialidad', 
      'Tipo_de_Diagnostico', 'Tipo_de_Atencion', 'Fecha_de_Nacimiento'
    ];

    const filas = datosActuales.map(d => {
      return [
        this.formatToLatinDate(d.consultationDate) || '',
        d.codeOA || '',
        d.medicalRecordCode || '',
        `"${(d.patientName || '').trim()}"`,
        d.identityDocument ? `"${d.identityDocument.trim()}"` : '',
        d.age ?? '',
        d.sex || '',
        d.diagnosisCode ? `"${d.diagnosisCode.trim()}"` : '',
        `"${(d.diagnosisDescription || '').trim()}"`,
        `"${(d.doctorName || '').trim()}"`,
        `"${(d.specialtyDescription || '').trim()}"`,
        d.diagnosisType || '',
        d.careType || '',
        this.formatToLatinDate(d.birthDate) || ''
      ].join(',');
    });

    const contenidoCsv = [encabezados.join(','), ...filas].join('\n');
    const blob = new Blob(['\uFEFF' + contenidoCsv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_Epidemiologico_${this.filterStartDate()}_al_${this.filterEndDate()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}