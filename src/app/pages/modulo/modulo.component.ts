import { Component, inject, OnInit } from '@angular/core';
import { ModuloService } from '../../services/modulo.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Modulo } from '../../interfaces/Modulo';
import { ModuloDialogComponent } from './dialog/modulo-dialog/modulo-dialog.component';
import { EliminadoComponent } from '../../shared/eliminado/eliminado.component';
import { BusquedaComponent } from '../../shared/busqueda/busqueda.component';

@Component({
  selector: 'app-modulo',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    BusquedaComponent
  ],
  templateUrl: './modulo.component.html',
  styleUrl: './modulo.component.css'
})
export class ModuloComponent implements OnInit{
  displayedColumns: string[] = ['idmodulo', 'permiso_idpermiso', 'rol_idrol', 'idcreador', 'fechacreacion', 'acciones'];
  dataSource: Modulo[] = [];
  modulos: Modulo[] = [];

  private moduloService = inject(ModuloService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerModulos();
  }

  // Obtener todos los módulos
  obtenerModulos() {
    this.moduloService.getModulos().subscribe({
      next: (data) => {
        const modulosProcesados = data.map(m => ({
          ...m,
          fechacreacion: this.fixDate(m.fechacreacion)
        }));
        this.modulos = modulosProcesados;
        this.dataSource = modulosProcesados;
      },
      error: (error) => console.error('Error al obtener módulos:', error)
    });
  }

  aplicarFiltro(filtro: string) {
    this.dataSource = this.modulos.filter(modulo =>
      modulo.idmodulo.toString().includes(filtro) ||
      modulo.permiso_idpermiso.toString().includes(filtro) ||
      modulo.rol_idrol.toString().includes(filtro)
    );
  }

  // Función para ajustar la fecha sin cambio de zona horaria
  fixDate(fecha: string | null): string {
    if (!fecha) return ''; // Retorna un string vacío si la fecha es null o undefined
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  // Eliminar un módulo
  eliminarModulo(id: number) {
    const dialogRef = this.dialog.open(EliminadoComponent, {
      width: '350px',
      data: { nombre: 'este módulo' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.moduloService.deleteModulo(id).subscribe({
          next: () => this.obtenerModulos(),
          error: (error) => {
            console.error('Error al eliminar módulo:', error);
          }
        });
      }
    });
  }

  abrirDialogo(modulo?: Modulo) {
    const dialogRef = this.dialog.open(ModuloDialogComponent, {
      width: '400px',
      data: modulo || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idmodulo) {
          this.moduloService.updateModulo(result.idmodulo, result).subscribe({
            next: () => this.obtenerModulos(),
            error: (error) => console.error('Error al actualizar módulo:', error)
          });
        } else {
          this.moduloService.createModulo(result).subscribe({
            next: () => this.obtenerModulos(),
            error: (error) => console.error('Error al crear módulo:', error)
          });
        }
      }
    });
  }
}