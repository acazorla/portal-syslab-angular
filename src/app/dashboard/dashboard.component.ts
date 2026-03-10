import { Component, signal, computed, inject,ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Asegúrate de importar ChartConfiguration y ChartData si quieres tipar fuertemente
import { BaseChartDirective } from 'ng2-charts';
// Importamos toSignal para la interoperabilidad con RxJS
import { toSignal } from '@angular/core/rxjs-interop';
import { IngresosService, IngresoMensual } from '../services/ingresos.service';
import { Chart, registerables,ChartConfiguration } from 'chart.js';
// Interfaces (Se mantienen igual)
interface MargenMensual extends IngresoMensual {
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Capturamos el primer elemento que tenga la directiva BaseChartDirective.
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  private ingresosService = inject(IngresosService);
  constructor() {
    // Registra todos los componentes por defecto de Chart.js
    // Esto soluciona los errores de "not a registered controller"
    Chart.register(...registerables);
    // Creamos un efecto que rastrea la señal barChartData().
    effect(() => {
      const data = this.barChartData();
    if (this.chart && this.chart.chart) {
        this.chart.update();
        this.chart.chart.resize();
        this.chart.chart.draw();
    }
    });
/*     effect(() => {
      // Invocamos la señal computada dentro del efecto para que se rastree automáticamente.
      const data = this.barChartData();
      const labels = this.barChartLabels();
      // Si el gráfico ya está inicializado y tenemos datos reales para mostrar.
if (this.chart) {
        
        // 2. Actualizamos los datos de la directiva
        this.chart.update(); 

        // 3. Accedemos de forma segura a la instancia interna (.chart)
        // Usamos el signo '?' para que TypeScript no marque error si es undefined
        const chartInstance = this.chart.chart;

        if (chartInstance && labels.length > 0 && data.datasets.length > 0) {
          console.log('--- [DEBUG] Redibujando ejes ---');
          this.chart.update(); 
          chartInstance.resize();
          chartInstance.draw();
        }
      }
    }); */
  }
  private ingresosRaw = toSignal(this.ingresosService.getIngresos(), { initialValue: [] });

  datos = computed<MargenMensual[]>(() => {
    return this.ingresosRaw().map(item => ({
      ...item,
      ingresoNeto: item.ingresos - item.costos,
      margenOperativo: item.ingresos ? ((item.ingresos - item.costos) / item.ingresos) : 0
    }));
  });
// tieneDatos() será true solo cuando la señal 'datos' tenga elementos.
  tieneDatos = computed<boolean>(() => {
    return this.datos().length > 0;
  });
//  barChartLabels = computed<string[]>(() => {
//    return this.datos().map(d => `${this.getNombreMes(d.mes)} ${d.periodo}`);
//  });
/*   public chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
              display: true,
              type: 'category',
              ticks: { autoSkip: false, color: '#000' }
            },
            y: { display: true, beginAtZero: true }
        }
  }; */
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        display: true,
        ticks: {
          autoSkip: false,
          color: '#000'
        }
      },
      y: {
        beginAtZero: true,
        display: true
      }
    }
  };
  // 1. REFACTORIZADO: Estructura correcta para ng2-charts (v4+)
  // Devolvemos un objeto con 'datasets', no un array.
/*   barChartData = computed(() => {
    const d = this.datos();
    return {
      datasets: [
        { data: d.map(item => item.ingresos), label: 'Ingresos', backgroundColor: '#667eea' },
        { data: d.map(item => item.costos), label: 'Costos', backgroundColor: '#e53935' },
        { data: d.map(item => item.ingresoNeto), label: 'Ingreso Neto', backgroundColor: '#388e3c' }
      ]
    };
  }); */
barChartData = computed(() => {
const d = this.datos();
return {
  labels: d.map(item => this.getNombreMes(item.mes) + ' ' + item.periodo),
  datasets: [
    { data: d.map(item => item.ingresos), label: 'Ingresos', backgroundColor: '#667eea' },
    { data: d.map(item => item.costos), label: 'Costos', backgroundColor: '#e53935' },
    { data: d.map(item => item.ingresoNeto), label: 'Ingreso Neto', backgroundColor: '#388e3c' }
  ]
};
});
//  lineChartLabels = this.barChartLabels;

  // 2. REFACTORIZADO: Estructura correcta para ng2-charts (v4+)
  // Devolvemos un objeto con 'datasets'.
  lineChartData = computed(() => {
    return {
      labels: this.datos().map(d => `${this.getNombreMes(d.mes)} ${d.periodo}`),
      datasets: [
        {
          data: this.datos().map(d => +(d.margenOperativo * 100).toFixed(2)),
          label: 'Margen Operativo (%)',
          borderColor: '#764ba2',
          fill: false
        }
      ]
    };
  });

  resumenTrimestral = computed<ResumenTrimestre[]>(() => {
    const resumenMap = new Map<string, ResumenTrimestre>();

    this.datos().forEach(item => {
      const key = `${item.trimestre}-${item.periodo}`;
      if (!resumenMap.has(key)) {
        resumenMap.set(key, {
          trimestre: item.trimestre,
          periodo: item.periodo,
          ingresos: 0,
          costos: 0,
          ingresoNeto: 0,
          margenOperativo: 0
        });
      }
      const resumen = resumenMap.get(key)!;
      resumen.ingresos += item.ingresos;
      resumen.costos += item.costos;
      resumen.ingresoNeto = resumen.ingresos - resumen.costos;
      resumen.margenOperativo = resumen.ingresos ? (resumen.ingresoNeto / resumen.ingresos) : 0;
    });

    return Array.from(resumenMap.values());
  });

  // --- Funciones Auxiliares ---

  // 3. CAMBIO DE VISIBILIDAD: De private a public (o sin modificador)
  // Angular moderno requiere que los métodos usados en plantillas sean públicos.
  getNombreMes(numero: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[numero - 1] || '';
  }
}