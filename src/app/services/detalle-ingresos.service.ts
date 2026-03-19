import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, delay } from 'rxjs';

// Definimos la estructura exacta del objeto "data" en tu JSON
export interface IngresoMensual {
  trimestre: string;
  periodo: string;
  mes: number;
  examen: string;
  totalServicios: number;
  ingresos: number;
  costos: number;
}

// Estructura completa de la respuesta de la API
export interface ApiResponse {
  success: boolean;
  message: string;
  data: IngresoMensual[];
  pagination: any;
  meta: any;
}

@Injectable({
  providedIn: 'root'
})
export class IngresosService {
  // Inyectamos el cliente HTTP de Angular
  private http = inject(HttpClient);

  // URL de tu API (donde tengas el endpoint que consulta a SQL Server)
  private apiUrl = 'api/v1/ingresos-laboratorio'; 

  /**
   * Obtiene los ingresos desde el backend.
   * Usamos 'map' para devolver directamente el array de datos.
   */
  getIngresos(): Observable<ApiResponse> {
    // Nota: Como no tenemos un backend real ahora, 
    // podrías usar un archivo JSON local o un mock.
//    return this.http.get<ApiResponse>(this.apiUrl).pipe(
//      // Simulamos un pequeño retraso de red para ver los estados de carga
//      delay(500) 
//    );
        return this.http.get<ApiResponse>('assets/data/examenmensual.json').pipe(
      // Simulamos un pequeño retraso de red para ver los estados de carga
      delay(500) 
    );
  }

  /**
   * Ejemplo de cómo enviar un nuevo reclamo (conectando con tu SP)
   */
  enviarReclamo(data: any): Observable<any> {
    return this.http.post('api/v1/reclamaciones', data);
  }
}