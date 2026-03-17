import { Component, computed, inject, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chart, registerables } from 'chart.js';

import { IngresosService } from '../services/ingresos.service';
import { IngresosDomainService } from '../core/domain/ingresos.mapper';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  private readonly ingresosService = inject(IngresosService);

  // 1. Datos brutos desde el servicio
  private readonly ingresosRaw = toSignal(this.ingresosService.getIngresos(), { initialValue: [] });

  // 2. Datos procesados por el Dominio (Capa de Negocio)
  readonly datos = computed(() => IngresosDomainService.calcularMargenes(this.ingresosRaw()));
  readonly tieneDatos = computed(() => this.datos().length > 0);
  readonly resumenTrimestral = computed(() => IngresosDomainService.agruparPorTrimestre(this.datos()));

  // 3. Configuración de Gráficos (Datos para el HTML)
  readonly barChartData = computed(() => {
    const d = this.datos();
    return {
      labels: d.map(item => `${this.getNombreMes(item.mes)} ${item.periodo}`),
      datasets: [
        { data: d.map(item => item.ingresos), label: 'Ingresos', backgroundColor: '#667eea' },
        { data: d.map(item => item.costos), label: 'Costos', backgroundColor: '#e53935' },
        { data: d.map(item => item.ingresoNeto), label: 'Ingreso Neto', backgroundColor: '#388e3c' }
      ]
    };
  });

  readonly lineChartData = computed(() => {
    const d = this.datos();
    return {
      labels: d.map(item => `${this.getNombreMes(item.mes)} ${item.periodo}`),
      datasets: [
        {
          data: d.map(item => +(item.margenOperativo * 100).toFixed(2)),
          label: 'Margen Operativo (%)',
          borderColor: '#764ba2',
          tension: 0.1,
          fill: false
        }
      ]
    };
  });

  readonly chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
  };

  constructor() {
    effect(() => {
      if (this.datos() && this.chart) {
        this.chart.update();
      }
    });
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
}