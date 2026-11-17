import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NEVER } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { HorarioService } from '../../Services/horario.service';

import { HorarioDetailsComponent } from './horario-details.component';

describe('HorarioDetailsComponent', () => {
  let component: HorarioDetailsComponent;
  let fixture: ComponentFixture<HorarioDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioDetailsComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: HorarioService, useValue: { getHorarioById: () => NEVER } }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorarioDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
