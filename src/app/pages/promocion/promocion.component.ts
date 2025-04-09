import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PromocionService } from '../../services/promocion.service';
import { Promocion } from '../../interfaces/Promocion';
import { PromocionDialogComponent } from './dialogs/promocion-dialog/promocion-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promocion',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './promocion.component.html',
  styleUrls: ['./promocion.component.css']
})
export class PromocionComponent implements OnInit {

  displayedColumns: string[] = ['idpromocion', 'empresa_idempresa', 'categoria_idcategoria', 'nombre', 'descripcion', 'vigenciainicio', 'vigenciafin', 'tipo', 'acciones'];
  dataSource: Promocion[] = [];

  private promocionService = inject(PromocionService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerPromociones();
  }

  obtenerPromociones() {
    this.promocionService.getPromociones().subscribe({
      next: (data) => {
        this.dataSource = data.map(promocion => ({
          ...promocion,
          vigenciainicio: this.fixDate(promocion.vigenciainicio),
          vigenciafin: this.fixDate(promocion.vigenciafin)
        }));
      },
      error: (error) => {
        console.error('Error al obtener promociones:', error);
      }
    });
  }
  
  // Función para ajustar la fecha sin cambio de zona horaria
  fixDate(fecha: string): string {
    if (!fecha) return '';
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }
  

  eliminarPromocion(id: number) {
    this.promocionService.deletePromocion(id).subscribe({
      next: () => {
        this.obtenerPromociones();
      },
      error: (error) => {
        console.error('Error al eliminar promoción:', error);
      }
    });
  }

  abrirDialogo(promocion?: Promocion) {
    const dialogRef = this.dialog.open(PromocionDialogComponent, {
      width: '400px',
      data: promocion || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idpromocion) {
          this.promocionService.updatePromocion(result.idpromocion, result).subscribe({
            next: () => this.obtenerPromociones(),
            error: (error) => console.error('Error al actualizar promoción:', error)
          });
        } else {
          this.promocionService.createPromocion(result).subscribe({
            next: () => this.obtenerPromociones(),
            error: (error) => console.error('Error al crear promoción:', error)
          });
        }
      }
    });
  }
}
