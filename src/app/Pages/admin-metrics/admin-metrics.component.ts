import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../Services/language.service';
import { MetricasIngresos, MetricasService, ResumenIngreso } from '../../Services/metricas.service';
import { formatDop } from '../../utils/currency';

@Component({
  selector: 'app-admin-metrics',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './admin-metrics.component.html',
  styleUrl: './admin-metrics.component.css'
})
export class AdminMetricsComponent implements OnInit {
  metricas: MetricasIngresos | null = null;
  cargando = true;
  error = false;

  constructor(
    private readonly metricasService: MetricasService,
    private readonly languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.cargarMetricas();
  }

  cargarMetricas(): void {
    this.cargando = true;
    this.error = false;

    this.metricasService.obtenerIngresos().subscribe({
      next: (metricas) => {
        this.metricas = metricas;
        this.cargando = false;
      },
      error: (error: unknown) => {
        console.error('Error al cargar las métricas de ingresos:', error);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  formatearMonto(total: number): string {
    return formatDop(total, this.languageService.currentLanguage);
  }

  nombreMes(periodo: string | number): string {
    const locale = this.languageService.currentLanguage === 'en' ? 'en-US' : 'es-DO';
    const fecha = new Date(2026, Number(periodo) - 1, 1);
    return new Intl.DateTimeFormat(locale, { month: 'short' }).format(fecha);
  }

  porcentaje(total: number, maximo: number): number {
    return maximo > 0 ? Math.max((total / maximo) * 100, total > 0 ? 2 : 0) : 0;
  }

  maximoTotal(registros: ResumenIngreso[]): number {
    return Math.max(...registros.map((registro) => registro.total), 0);
  }
}
