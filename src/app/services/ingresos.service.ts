import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
//import { IngresosService } from '../services/ingresos.service';
export interface IngresoMensual {
  trimestre: string;
  periodo: string;
  mes: number;
  ingresos: number;
  costos: number;
}

@Injectable({ providedIn: 'root' })
export class IngresosService {
  constructor(private http: HttpClient) {}

  getIngresos(): Observable<IngresoMensual[]> {
    return this.http.get<any>('assets/data/ingresomensual.json').pipe(
      map((res: any) => res.data as IngresoMensual[])
    );
  }
}