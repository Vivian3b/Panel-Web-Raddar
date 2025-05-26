import { Component, inject } from '@angular/core';
import { Permiso } from '../../interfaces/Permiso';
import { PermisoService } from '../../services/permiso.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PermisoDialogComponent } from './dialog/permiso-dialog/permiso-dialog.component';

@Component({
  selector: 'app-permiso',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './permiso.component.html',
  styleUrl: './permiso.component.css'
})
export class PermisoComponent {
  displayedColumns: string[] = ['idpermiso', 'nombre', 'idcreador', 'idactualizacion', 'fechacreacion', 'fechaactualizacion', 'acciones'];
  dataSource: Permiso[] = [];

  private permisoService = inject(PermisoService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerPermisos();
  }

  // Obtener todos los permisos
  obtenerPermisos() {
    this.permisoService.getPermisos().subscribe({
      next: (data) => {
        this.dataSource = data.map(permiso => ({
          ...permiso,
          fechacreacion: this.fixDate(permiso.fechacreacion)
        }));
      },
      error: (error) => {
        console.error('Error al obtener permisos:', error);
      }
    });
  }

  // Función para ajustar la fecha sin cambio de zona horaria
  fixDate(fecha: string | null): string {
    if (!fecha) return ''; // Retorna un string vacío si la fecha es null o undefined
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }


  // Eliminar un permiso
  eliminarPermiso(id: number) {
    this.permisoService.deletePermiso(id).subscribe({
      next: () => {
        this.obtenerPermisos();
      },
      error: (error) => {
        console.error('Error al eliminar permiso:', error);
      }
    });
  }

  // Función para abrir el dialogo de crear/editar permiso
  abrirDialogo(permiso?: Permiso) {
    
    const dialogRef = this.dialog.open(PermisoDialogComponent, {
      width: '400px',
      data: permiso || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idpermiso) {
          this.permisoService.updatePermiso(result.idpermiso, result).subscribe({
            next: () => this.obtenerPermisos(),
            error: (error) => console.error('Error al actualizar permiso:', error)
          });
        } else {
          this.permisoService.createPermiso(result).subscribe({
            next: () => this.obtenerPermisos(),
            error: (error) => console.error('Error al crear permiso:', error)
          });
        }
      }
    });
  }
}