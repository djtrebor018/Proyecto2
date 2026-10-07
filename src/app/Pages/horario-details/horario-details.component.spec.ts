import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioDetailsComponent } from './horario-details.component';

describe('HorarioDetailsComponent', () => {
  let component: HorarioDetailsComponent;
  let fixture: ComponentFixture<HorarioDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioDetailsComponent]
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
