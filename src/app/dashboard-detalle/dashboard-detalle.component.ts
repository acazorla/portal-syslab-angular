import { Component, signal, computed, inject,ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Asegúrate de importar ChartConfiguration y ChartData si quieres tipar fuertemente
import { BaseChartDirective } from 'ng2-charts';
// Importamos toSignal para la interoperabilidad con RxJS
import { toSignal } from '@angular/core/rxjs-interop';
import { IngresosService, IngresoMensual } from '../services/detalle-ingresos.service';
import { Chart, registerables,ChartConfiguration,ChartData } from 'chart.js';
// Interfaces (Se mantienen igual)
/* interface MargenMensual extends IngresoMensual {
  ingresoNeto: number;
  margenOperativo: number;
}

interface ResumenTrimestre {
  trimestre: string;
  periodo: string;
  ingresos: number;
  costos: number;
  ingresoNeto: number;
  margenOperativo: number;
}
 */
// Agrega esta interfaz (puede ir arriba de tu componente o en un archivo de modelos)
interface ResumenExamenQuarter {
  examen: string;
  ingresos: number;
  costos: number;
  utilidad: number;
}

interface ResumenPorQuarter {
  quarter: string;
  examenes: ResumenExamenQuarter[];
  totales: { ingresos: number; costos: number; utilidad: number };
}

@Component({
  selector: 'app-dashboard-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard-detalle.component.html',
  styleUrls: ['./dashboard-detalle.component.css']
})
export class DashboardDetalleComponent {
private ingresosService = inject(IngresosService);
  //----------------------------------------------------------------------------------------
  // 3. NUEVO: Lógica para el Cuadro Resumen (Agrupado por Quarter y luego por Examen)
  resumenPorQuarter = computed<ResumenPorQuarter[]>(() => {
    const filtrados = this.datosTabla();
    const resumenMap = new Map<string, Map<string, ResumenExamenQuarter>>();

    filtrados.forEach(item => {
      const quarterKey = `${item.trimestre} ${item.periodo}`;
      const examenKey = item.examen;

      // Inicializa el mapa del Quarter si no existe
      if (!resumenMap.has(quarterKey)) {
        resumenMap.set(quarterKey, new Map<string, ResumenExamenQuarter>());
      }

      const examenesMap = resumenMap.get(quarterKey)!;

      // Inicializa el registro del Examen si no existe
      if (!examenesMap.has(examenKey)) {
        examenesMap.set(examenKey, { examen: examenKey, ingresos: 0, costos: 0, utilidad: 0 });
      }

      // Suma los valores
      const registro = examenesMap.get(examenKey)!;
      registro.ingresos += item.ingresos;
      registro.costos += item.costos;
      registro.utilidad += (item.ingresos - item.costos);
    });

    // Transforma los Mapas en un Array ordenado para el HTML
    return Array.from(resumenMap.entries()).map(([quarter, examenesMap]) => {
      const examenesArray = Array.from(examenesMap.values());
      
      // Calcular totales por Quarter
      const totales = examenesArray.reduce(
        (acc, curr) => {
          acc.ingresos += curr.ingresos;
          acc.costos += curr.costos;
          acc.utilidad += curr.utilidad;
          return acc;
        },
        { ingresos: 0, costos: 0, utilidad: 0 }
      );

      return {
        quarter,
        examenes: examenesArray,
        totales
      };
    });
  });
  //----------------------------------------------------------------------------------------
  // Datos crudos del servicio
  private response = toSignal(this.ingresosService.getIngresos());
  
  // Signal para los Quarters seleccionados (Multiselect)
  quartersSeleccionados = signal<string[]>(['Q1 2026']); 

  // Obtener lista única de Quarters para el filtro
  listaQuarters = computed(() => {
    const raw = this.response()?.data || [];
    return [...new Set(raw.map(item => `${item.trimestre} ${item.periodo}`))];
  });

  // 1. Lógica para la Tabla (Datos filtrados pero sin agrupar)
  datosTabla = computed(() => {
    const raw = this.response()?.data || [];
    const seleccion = this.quartersSeleccionados();
    return raw.filter(item => seleccion.includes(`${item.trimestre} ${item.periodo}`));
  });

  // 2. Lógica para la Gráfica (Agrupado por Examen)
  pieChartData = computed<ChartData<'pie'>>(() => {
    const filtrados = this.datosTabla();
    const agrupadosExamen = new Map<string, number>();

    filtrados.forEach(item => {
      const utilidad = item.ingresos - item.costos;
      const actual = agrupadosExamen.get(item.examen) || 0;
      agrupadosExamen.set(item.examen, actual + utilidad);
    });

    return {
      labels: Array.from(agrupadosExamen.keys()),
      datasets: [{
        data: Array.from(agrupadosExamen.values()),
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'],
        hoverOffset: 15
      }]
    };
  });

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: (context) => ` Utilidad Total: $${context.parsed.toLocaleString()}`
        }
      }
    }
  };
    getNombreMes(mes: number): string {
    const fecha = new Date(2024, mes - 1, 1);
    const nombre = fecha.toLocaleString('es-ES', { month: 'long' });
    return nombre.charAt(0).toUpperCase() + nombre.slice(1); // Capitalizar
  }
    descargarReporte(): void {
    const datosActuales = this.datosTabla();
 
    if (!datosActuales.length) return;
       const encabezados = ['Periodo', 'Mes', 'Examen', 'Ingresos', 'Costos', 'Utilidad', 'Margen %'];
    const filas = datosActuales.map(d => [
      d.periodo,
      this.getNombreMes(d.mes),
      d.examen,  
      d.ingresos.toFixed(2),
      d.costos.toFixed(2),
      (d.ingresos-d.costos).toFixed(2),
      (((d.ingresos-d.costos) / d.ingresos) * 100).toFixed(2)
    ].join(',')); 

      const contenido = '\ufeff' + [encabezados.join(','), ...filas].join('\n');
      const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);

      const nombreArchivo = `Reporte_SysLab_${datosActuales[0].periodo}.csv`;
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.setAttribute('download', nombreArchivo);

      document.body.appendChild(enlace);
      enlace.click();

      document.body.removeChild(enlace);
      window.URL.revokeObjectURL(url);
  }
  exportToPdf() {
    window.print();
  }
  // Función para manejar el cambio en el multiselect
  onQuarterChange(event: Event) {
    const options = (event.target as HTMLSelectElement).options;
    const values: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) values.push(options[i].value);
    }
    this.quartersSeleccionados.set(values);
  }
}