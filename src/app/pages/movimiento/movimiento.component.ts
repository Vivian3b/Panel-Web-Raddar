import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MovimientoService } from '../../services/movimiento.service';
import { MatDialog } from '@angular/material/dialog';
import { Movimiento } from '../../interfaces/Movimiento';
import { BusquedaComponent } from '../../shared/busqueda/busqueda.component';
import { EliminadoComponent } from '../../shared/eliminado/eliminado.component';

@Component({
  selector: 'app-movimiento',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    BusquedaComponent
  ],
  templateUrl: './movimiento.component.html',
  styleUrl: './movimiento.component.css'
})
export class MovimientoComponent implements OnInit{

  displayedColumns: string[] = ['idmovimiento', 'cliente_idcliente', 'metododepago_idmetododepago', 'promocion_idpromocion', 'fechamoviento', 'montototal', 'iva', 'acciones'];
  dataSource: Movimiento[] = [];
  todasLasMovimientos: Movimiento[] = [];
  filtroTexto: string = '';

  private movimientoService = inject(MovimientoService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerMovimientos();
  }

  obtenerMovimientos() {
    this.movimientoService.getMovimientos().subscribe({
      next: (data) => {
        this.todasLasMovimientos = data.filter(movimiento => movimiento.eliminado !== 1);
        this.aplicarFiltro(this.filtroTexto);
      },
      error: (error) => {
        console.error('Error al obtener movimientos:', error);
      }
    });
  }

  aplicarFiltro(texto: string) {
    this.filtroTexto = texto;
    const filtro = texto.trim().toLowerCase();
    this.dataSource = this.todasLasMovimientos.filter(movimiento =>
      movimiento.idmovimiento.toString().includes(filtro) ||
      movimiento.cliente_idcliente.toString().includes(filtro) ||
      movimiento.metododepago_idmetododepago.toString().includes(filtro) ||
      movimiento.promocion_idpromocion.toString().includes(filtro) ||
      (movimiento.fechamoviento && movimiento.fechamoviento.toLowerCase().includes(filtro)) ||
      movimiento.montototal.toString().includes(filtro) ||
      movimiento.iva.toString().includes(filtro)
    );
  }

  eliminarMovimiento(id: number) {
    const dialogRef = this.dialog.open(EliminadoComponent, {
      width: '350px',
      data: { nombre: 'movimiento' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movimientoService.deleteMovimiento(id).subscribe({
          next: () => this.obtenerMovimientos(),
          error: (error) => console.error('Error al eliminar movimiento:', error)
        });
      }
    });
  }
}
