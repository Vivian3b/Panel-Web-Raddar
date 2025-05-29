import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PromocionService } from '../../services/promocion.service';
import { Promocion } from '../../interfaces/Promocion';
import { PromocionDialogComponent } from './dialogs/promocion-dialog/promocion-dialog.component';
import { CommonModule } from '@angular/common';
import { EliminadoComponent } from '../../shared/eliminado/eliminado.component';
import { BusquedaComponent } from '../../shared/busqueda/busqueda.component';

@Component({
  selector: 'app-promocion',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    BusquedaComponent
  ],
  templateUrl: './promocion.component.html',
  styleUrls: ['./promocion.component.css']
})
export class PromocionComponent implements OnInit {

  displayedColumns: string[] = ['idpromocion', 'empresa_idempresa', 'categoria_idcategoria', 'nombre', 'descripcion', 'precio', 'vigenciainicio', 'vigenciafin', 'tipo', 'acciones'];
  dataSource: Promocion[] = [];
  promocionesOriginales: Promocion[] = [];

  private promocionService = inject(PromocionService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerPromociones();
  }

  obtenerPromociones() {
    this.promocionService.getPromociones().subscribe({
      next: (data) => {
        const procesadas = data.map(promocion => ({
          ...promocion,
          vigenciainicio: this.fixDate(promocion.vigenciainicio),
          vigenciafin: this.fixDate(promocion.vigenciafin)
        }));
        this.promocionesOriginales = procesadas; // ✅ Guardamos originales
        this.dataSource = [...procesadas];       // ✅ Copiamos a dataSource
      },
      error: (error) => {
        console.error('Error al obtener promociones:', error);
      }
    });
  }

  aplicarFiltro(texto: string) {
    this.dataSource = this.promocionesOriginales.filter(p =>
      Object.values(p).some(valor =>
        valor?.toString().toLowerCase().includes(texto)
      )
    );
  }
  
  // Función para ajustar la fecha sin cambio de zona horaria
  fixDate(fecha: string): string {
    if (!fecha) return '';
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }
  

  eliminarPromocion(id: number) {
  const dialogRef = this.dialog.open(EliminadoComponent, {
    width: '350px',
    data: { nombre: 'promoción' } // texto genérico o específico
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.promocionService.deletePromocion(id).subscribe({
        next: () => this.obtenerPromociones(),
        error: (error) => {
          console.error('Error al eliminar promoción:', error);
        }
      });
    }
  });
}

  abrirDialogo(promocion?: Promocion) {
    const dialogRef = this.dialog.open(PromocionDialogComponent, {
      width: '400px',
      data: promocion || {}
    });

    dialogRef.afterClosed().subscribe((recargar) => {
      if (recargar) {
        this.obtenerPromociones();
      }
    });
  }
}
