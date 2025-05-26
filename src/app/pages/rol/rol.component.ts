import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Rol } from '../../interfaces/Rol';
import { RolService } from '../../services/rol.service';
import { MatDialog } from '@angular/material/dialog';
import { RolDialogComponent } from './dialog/rol-dialog/rol-dialog.component';
import { BusquedaComponent } from '../../shared/busqueda/busqueda.component';

@Component({
  selector: 'app-rol',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    BusquedaComponent
  ],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css'
})
export class RolComponent implements OnInit{
  displayedColumns: string[] = ['idrol', 'nombre', 'idcreador', 'idactualizacion', 'fechacreacion', 'fechaactualizacion', 'acciones'];
  dataSource: Rol[] = [];
  roles: Rol[] = [];

  private rolService = inject(RolService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerRoles();
  }

  obtenerRoles() {
    this.rolService.getRoles().subscribe({
      next: (data) => {
        const rolesProcesados = data.map(rol => ({
          ...rol,
          fechacreacion: this.fixDate(rol.fechacreacion),
          fechaactualizacion: this.fixDate(rol.fechaactualizacion)
        }));

        this.roles = rolesProcesados; // ✅ Guardar lista completa
        this.dataSource = rolesProcesados;
      },
      error: (error) => console.error('Error al obtener roles:', error)
    });
  }

  // ✅ NUEVO MÉTODO
  aplicarFiltro(filtro: string) {
    this.dataSource = this.roles.filter(rol =>
      rol.nombre.toLowerCase().includes(filtro)
    );
  }

  fixDate(fecha: string): string {
    if (!fecha) return '';
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  eliminarRol(id: number) {
    this.rolService.deleteRol(id).subscribe({
      next: () => this.obtenerRoles(),
      error: (error) => console.error('Error al eliminar rol:', error)
    });
  }

  abrirDialogo(rol?: Rol) {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width: '400px',
      data: rol || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idrol) {
          this.rolService.updateRol(result.idrol, result).subscribe({
            next: () => this.obtenerRoles(),
            error: (error) => console.error('Error al actualizar rol:', error)
          });
        } else {
          this.rolService.createRol(result).subscribe({
            next: () => this.obtenerRoles(),
            error: (error) => console.error('Error al crear rol:', error)
          });
        }
      }
    });
  }
}