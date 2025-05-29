import { Component, inject } from '@angular/core';
import { Permiso } from '../../interfaces/Permiso';
import { PermisoService } from '../../services/permiso.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PermisoDialogComponent } from './dialog/permiso-dialog/permiso-dialog.component';
import { EliminadoComponent } from '../../shared/eliminado/eliminado.component';
import { BusquedaComponent } from '../../shared/busqueda/busqueda.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-permiso',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    BusquedaComponent
  ],
  templateUrl: './permiso.component.html',
  styleUrl: './permiso.component.css'
})
export class PermisoComponent {
  displayedColumns: string[] = ['idpermiso', 'nombre', 'idcreador', 'idactualizacion', 'fechacreacion', 'fechaactualizacion', 'acciones'];
  dataSource: Permiso[] = [];
  permisos: Permiso[] = [];

  private permisoService = inject(PermisoService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerPermisos();
  }

  // Obtener todos los permisos
  obtenerPermisos() {
    this.permisoService.getPermisos().subscribe({
      next: (data) => {
        const permisosProcesados = data.map(p => ({
          ...p,
          fechacreacion: this.fixDate(p.fechacreacion),
          fechaactualizacion: this.fixDate(p.fechaactualizacion)
        }));
        this.permisos = permisosProcesados; // lista completa
        this.dataSource = permisosProcesados;
      },
      error: (error) => console.error('Error al obtener permisos:', error)
    });
  }

  aplicarFiltro(filtro: string) {
    this.dataSource = this.permisos.filter(permiso =>
      permiso.nombre.toLowerCase().includes(filtro)
    );
  }

  // Función para ajustar la fecha sin cambio de zona horaria
  fixDate(fecha: string | null): string {
    if (!fecha) return ''; // Retorna un string vacío si la fecha es null o undefined
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }


  // Eliminar un permiso
  eliminarPermiso(id: number) {
    const dialogRef = this.dialog.open(EliminadoComponent, {
      width: '350px',
      data: { nombre: 'permiso' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.permisoService.deletePermiso(id).subscribe({
          next: () => this.obtenerPermisos(),
          error: (error) => console.error('Error al eliminar permiso:', error)
        });
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