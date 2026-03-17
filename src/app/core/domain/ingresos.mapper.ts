import { IngresoMensual } from '../../services/ingresos.service';
import { MargenMensual, ResumenTrimestre } from '../../dashboard/dashboard.models';

export class IngresosDomainService {
  
  // Lógica pura: Transforma datos brutos en datos de negocio
  static calcularMargenes(ingresos: IngresoMensual[]): MargenMensual[] {
    return ingresos.map(item => ({
      ...item,
      ingresoNeto: item.ingresos - item.costos,
      margenOperativo: item.ingresos ? ((item.ingresos - item.costos) / item.ingresos) : 0
    }));
  }

  static agruparPorTrimestre(datos: MargenMensual[]): ResumenTrimestre[] {
    const agrupado = datos.reduce((acc, item) => {
      const key = `${item.trimestre}-${item.periodo}`;
      if (!acc[key]) {
        acc[key] = { 
          trimestre: item.trimestre, 
          periodo: item.periodo, 
          ingresos: 0, costos: 0, 
          ingresoNeto: 0, margenOperativo: 0 
        };
      }
      const r = acc[key];
      r.ingresos += item.ingresos;
      r.costos += item.costos;
      r.ingresoNeto = r.ingresos - r.costos;
      r.margenOperativo = r.ingresos ? (r.ingresoNeto / r.ingresos) : 0;
      return acc;
    }, {} as Record<string, ResumenTrimestre>);

    return Object.values(agrupado);
  }
}