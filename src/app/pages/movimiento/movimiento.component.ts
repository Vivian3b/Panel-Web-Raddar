import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MovimientoService } from '../../services/movimiento.service';
import { MatDialog } from '@angular/material/dialog';
import { Movimiento } from '../../interfaces/Movimiento';

@Component({
  selector: 'app-movimiento',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './movimiento.component.html',
  styleUrl: './movimiento.component.css'
})
export class MovimientoComponent implements OnInit{

  displayedColumns: string[] = ['idmovimiento', 'cliente_idcliente', 'metododepago_idmetododepago', 'promocion_idpromocion', 'fechamoviento', 'montototal', 'iva', 'montosubtotal', 'acciones'];
  dataSource: Movimiento[] = [];

  private movimientoService = inject(MovimientoService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerMovimientos();
  }

  obtenerMovimientos() {
    this.movimientoService.getMovimientos().subscribe({
      next: (data) => {
        // Filtra el campo 'eliminado' para no mostrarlo en la tabla
        this.dataSource = data.filter(movimiento => movimiento.eliminado !== 1);
      },
      error: (error) => {
        console.error('Error al obtener movimientos:', error);
      }
    });
  }

  eliminarMovimiento(id: number) {
    this.movimientoService.deleteMovimiento(id).subscribe({
      next: () => {
        this.obtenerMovimientos();
      },
      error: (error) => {
        console.error('Error al eliminar movimiento:', error);
      }
    });
  }

  abrirDialogo(movimiento?: Movimiento) {
    // Abre el diálogo para agregar o editar el movimiento
  }
}
