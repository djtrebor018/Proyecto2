import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { LanguageService } from '../../Services/language.service';
import { MetricasIngresos, MetricasService } from '../../Services/metricas.service';
import { AdminMetricsComponent } from './admin-metrics.component';

describe('AdminMetricsComponent', () => {
  let component: AdminMetricsComponent;
  let fixture: ComponentFixture<AdminMetricsComponent>;
  let metricasService: jasmine.SpyObj<MetricasService>;

  const metricas: MetricasIngresos = {
    zonaHoraria: 'America/Santo_Domingo',
    moneda: 'DOP',
    resumen: {
      dia: { periodo: '2026-11-04', total: 100, cantidadPagos: 2 },
      mes: { periodo: '2026-11', total: 500, cantidadPagos: 8 },
      anio: { periodo: 2026, total: 1200, cantidadPagos: 20 }
    },
    ingresosPorMes: [
      { periodo: 11, total: 500, cantidadPagos: 8 }
    ],
    ingresosPorDia: [
      { periodo: 4, total: 100, cantidadPagos: 2 }
    ]
  };

  beforeEach(async () => {
    metricasService = jasmine.createSpyObj<MetricasService>('MetricasService', ['obtenerIngresos']);
    metricasService.obtenerIngresos.and.returnValue(of(metricas));

    await TestBed.configureTestingModule({
      imports: [AdminMetricsComponent, TranslateModule.forRoot()],
      providers: [
        { provide: MetricasService, useValue: metricasService },
        { provide: LanguageService, useValue: { currentLanguage: 'es' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads the income summary and daily and monthly data', () => {
    const content = fixture.nativeElement.textContent as string;

    expect(metricasService.obtenerIngresos).toHaveBeenCalled();
    expect(component.metricas).toEqual(metricas);
    expect(content).toContain('America/Santo_Domingo');
    expect(content).toContain('METRICS.MONTHLY_INCOME');
    expect(content).toContain('METRICS.DAILY_INCOME');
    expect(fixture.nativeElement.querySelectorAll('.metric-card').length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('.bar-column').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.bar-fill').length).toBe(2);
    const root = fixture.nativeElement as HTMLElement;
    const chartColumns = root.querySelectorAll('.row.g-4 > div');
    expect(chartColumns.length).toBe(2);
    expect(Array.from(chartColumns).every((column) => column.classList.contains('col-lg-6'))).toBeTrue();
    expect(root.querySelectorAll('[aria-orientation="vertical"]').length).toBe(2);
    expect(root.querySelector('.bar-fill')?.getAttribute('style')).toContain('height');
  });
});
