import { Component, inject, OnInit } from '@angular/core';
import { ModuloService } from '../../services/modulo.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Modulo } from '../../interfaces/Modulo';

@Component({
  selector: 'app-modulo',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './modulo.component.html',
  styleUrl: './modulo.component.css'
})
export class ModuloComponent implements OnInit{
  displayedColumns: string[] = ['idmodulo', 'permiso_idpermiso', 'rol_idrol', 'idcreador', 'fechacreacion', 'acciones'];
  dataSource: Modulo[] = [];

  private moduloService = inject(ModuloService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerModulos();
  }

  // Obtener todos los módulos
  obtenerModulos() {
    this.moduloService.getModulos().subscribe({
      next: (data) => {
        this.dataSource = data.map(modulo => ({
          ...modulo,
          fechacreacion: this.fixDate(modulo.fechacreacion)
        }));
      },
      error: (error) => {
        console.error('Error al obtener módulos:', error);
      }
    });
  }

  // Función para ajustar la fecha sin cambio de zona horaria
  fixDate(fecha: string | null): string {
    if (!fecha) return ''; // Retorna un string vacío si la fecha es null o undefined
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  // Eliminar un módulo
  eliminarModulo(id: number) {
    this.moduloService.deleteModulo(id).subscribe({
      next: () => {
        this.obtenerModulos();
      },
      error: (error) => {
        console.error('Error al eliminar módulo:', error);
      }
    });
  }

  // Función para abrir el dialogo de crear/editar módulo
  abrirDialogo(modulo?: Modulo) {
    /*
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
    */
  }
}