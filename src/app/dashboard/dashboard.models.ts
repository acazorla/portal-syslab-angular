import { IngresoMensual } from '../services/ingresos.service';

export interface MargenMensual extends IngresoMensual {
  ingresoNeto: number;
  margenOperativo: number;
}

export interface ResumenTrimestre {
  trimestre: string;
  periodo: string;
  ingresos: number;
  costos: number;
  ingresoNeto: number;
  margenOperativo: number;
}
