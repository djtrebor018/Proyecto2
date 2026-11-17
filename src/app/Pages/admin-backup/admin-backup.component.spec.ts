import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AdminDataService } from '../../Services/admin-data.service';
import { AdminBackupComponent } from './admin-backup.component';

describe('AdminBackupComponent', () => {
  let component: AdminBackupComponent;
  let fixture: ComponentFixture<AdminBackupComponent>;
  let adminData: jasmine.SpyObj<AdminDataService>;

  beforeEach(async () => {
    adminData = jasmine.createSpyObj<AdminDataService>('AdminDataService', ['descargarBackup']);

    await TestBed.configureTestingModule({
      imports: [AdminBackupComponent, TranslateModule.forRoot()],
      providers: [{ provide: AdminDataService, useValue: adminData }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts a backup download', fakeAsync(() => {
    adminData.descargarBackup.and.returnValue(of(new HttpResponse({
      body: new Blob(['backup'], { type: 'application/sql' }),
      headers: new HttpHeaders({ 'Content-Disposition': 'attachment; filename="backup-2026.sql"' })
    })));
    spyOn(URL, 'createObjectURL').and.returnValue('blob:backup');
    spyOn(URL, 'revokeObjectURL');
    spyOn(HTMLAnchorElement.prototype, 'click');

    component.descargarBackup();
    tick();

    expect(adminData.descargarBackup).toHaveBeenCalled();
    expect(component.descargando).toBeFalse();
    expect(component.error).toBe('');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:backup');
  }));

  it('shows the backend error when backup download fails', async () => {
    adminData.descargarBackup.and.returnValue(throwError(() => new Error('unavailable')));
    spyOn(console, 'error');

    component.descargarBackup();
    await fixture.whenStable();

    expect(component.error).toBe('ADMIN.BACKUP_ERROR');
    expect(component.descargando).toBeFalse();
  });
});
