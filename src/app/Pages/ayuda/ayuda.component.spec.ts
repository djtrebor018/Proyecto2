import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AyudaComponent } from './ayuda.component';

describe('AyudaComponent', () => {
  let component: AyudaComponent;
  let fixture: ComponentFixture<AyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyudaComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts a guide and moves between its steps', () => {
    component.iniciarGuia(component.guias[0]);
    expect(component.pasoActual).toBe(0);
    expect(component.pasoGuiaActual?.titleKey).toBe('HELP.GUIDES.REGISTRATION.STEPS.1.TITLE');
    expect(component.progresoGuia).toBe(25);

    component.siguientePaso();
    expect(component.pasoActual).toBe(1);
    component.pasoAnterior();
    expect(component.pasoActual).toBe(0);
    component.pasoAnterior();
    expect(component.pasoActual).toBe(0);
  });

  it('provides separate step-by-step guides for registration and login', () => {
    const registrationGuide = component.guias.find((guide) => guide.id === 'registration');
    const loginGuide = component.guias.find((guide) => guide.id === 'login');

    expect(registrationGuide?.route).toBe('/registro');
    expect(registrationGuide?.steps.length).toBeGreaterThan(0);
    expect(loginGuide?.route).toBe('/');
    expect(loginGuide?.steps.length).toBeGreaterThan(0);

    if (loginGuide) {
      component.iniciarGuia(loginGuide);
      expect(component.pasoGuiaActual?.titleKey).toBe('HELP.GUIDES.LOGIN.STEPS.1.TITLE');
    }
  });

  it('keeps the guide on its final step and resets when returning to the guide list', () => {
    const guide = component.guias[0];
    component.iniciarGuia(guide);

    for (let step = 0; step < guide.steps.length + 1; step++) {
      component.siguientePaso();
    }

    expect(component.pasoActual).toBe(guide.steps.length - 1);
    expect(component.progresoGuia).toBe(100);

    component.volverAGuias();
    expect(component.guiaSeleccionada).toBeNull();
    expect(component.pasoActual).toBe(0);
  });
});
