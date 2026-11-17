import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AdminDataService } from '../../Services/admin-data.service';

@Component({
  selector: 'app-admin-backup',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './admin-backup.component.html'
})
export class AdminBackupComponent {
  descargando = false;
  error = '';

  constructor(private readonly adminData: AdminDataService) {}

  descargarBackup(): void {
    if (this.descargando) {
      return;
    }

    this.descargando = true;
    this.error = '';
    this.adminData.descargarBackup().subscribe({
      next: (response) => {
        if (!response.body || response.body.size === 0) {
          this.error = 'ADMIN.BACKUP_EMPTY';
          this.descargando = false;
          return;
        }

        this.guardarArchivo(response, response.body);
        this.descargando = false;
      },
      error: (error: unknown) => {
        console.error('Error al descargar el respaldo de la base de datos:', error);
        this.mostrarError(error).finally(() => {
          this.descargando = false;
        });
      }
    });
  }

  private guardarArchivo(response: HttpResponse<Blob>, body: Blob): void {
    const filename = this.nombreArchivo(response.headers.get('Content-Disposition'));
    const url = URL.createObjectURL(body);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url));
  }

  private nombreArchivo(contentDisposition: string | null): string {
    const candidate = contentDisposition?.match(/filename="?([^";]+)"?/i)?.[1];
    const sanitized = candidate?.replace(/[^a-zA-Z0-9._-]/g, '');
    return sanitized && sanitized.toLowerCase().endsWith('.sql')
      ? sanitized
      : `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
  }

  private async mostrarError(error: unknown): Promise<void> {
    if (!(error instanceof HttpErrorResponse)) {
      this.error = 'ADMIN.BACKUP_ERROR';
      return;
    }

    const responseBody = error.error;
    if (responseBody instanceof Blob) {
      try {
        const parsed: unknown = JSON.parse(await responseBody.text());
        if (typeof parsed === 'object' && parsed !== null && 'msg' in parsed && typeof parsed.msg === 'string') {
          this.error = parsed.msg;
          return;
        }
      } catch (parseError: unknown) {
        console.error('No se pudo leer o interpretar el error de descarga del respaldo:', parseError);
      }
    } else if (typeof responseBody === 'object' && responseBody !== null &&
      'msg' in responseBody && typeof responseBody.msg === 'string') {
      this.error = responseBody.msg;
      return;
    }

    this.error = 'ADMIN.BACKUP_ERROR';
  }
}
