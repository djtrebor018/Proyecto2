import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthServicesService } from '../../Services/auth-services.service';
import { AdminLayoutComponent } from './admin-layout.component';

describe('AdminLayoutComponent', () => {
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthServicesService, useValue: jasmine.createSpyObj('AuthServicesService', ['Logout']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    fixture.detectChanges();
  });

  it('shows the admin navbar and child route outlet', () => {
    expect(fixture.nativeElement.querySelector('app-admin-navbar')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
