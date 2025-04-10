import { Component, inject } from '@angular/core';
import { Notificacion } from '../../interfaces/Notificacion';
import { NotificacionService } from '../../services/notificacion.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notificacion',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './notificacion.component.html',
  styleUrl: './notificacion.component.css'
})
export class NotificacionComponent {
  displayedColumns: string[] = ['idnotificacion', 'cliente_idcliente', 'promocion_idpromocion', 'fechayhora', 'leido', 'acciones'];
  dataSource: Notificacion[] = [];

  private notificacionService = inject(NotificacionService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerNotificaciones();
  }

  obtenerNotificaciones() {
    this.notificacionService.getNotificaciones().subscribe({
      next: (data) => {
        this.dataSource = data.map(notificacion => ({
          ...notificacion,
          fechayhora: this.fixDate(notificacion.fechayhora)
        }));
      },
      error: (error) => {
        console.error('Error al obtener notificaciones:', error);
      }
    });
  }

  // Función para ajustar la fecha sin cambio de zona horaria
  fixDate(fecha: string): string {
    if (!fecha) return '';
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  eliminarNotificacion(id: number) {
    this.notificacionService.deleteNotificacion(id).subscribe({
      next: () => {
        this.obtenerNotificaciones();
      },
      error: (error) => {
        console.error('Error al eliminar notificación:', error);
      }
    });
  }

  abrirDialogo(notificacion?: Notificacion) {
    /*
    const dialogRef = this.dialog.open(NotificacionDialogComponent, {
      width: '400px',
      data: notificacion || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idnotificacion) {
          this.notificacionService.updateNotificacion(result.idnotificacion, result).subscribe({
            next: () => this.obtenerNotificaciones(),
            error: (error) => console.error('Error al actualizar notificación:', error)
          });
        } else {
          this.notificacionService.createNotificacion(result).subscribe({
            next: () => this.obtenerNotificaciones(),
            error: (error) => console.error('Error al crear notificación:', error)
          });
        }
      }
    });*/
  }
}