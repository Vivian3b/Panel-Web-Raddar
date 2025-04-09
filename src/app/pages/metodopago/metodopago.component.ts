import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MetodoPago } from '../../interfaces/Metodopago';
import { MetodopagoService } from '../../services/metodopago.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-metodopago',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './metodopago.component.html',
  styleUrl: './metodopago.component.css'
})
export class MetodopagoComponent implements OnInit{
  displayedColumns: string[] = ['idmetododepago', 'cliente_idcliente', 'tipo', 'acciones'];
  dataSource: MetodoPago[] = [];

  private metodoDePagoService = inject(MetodopagoService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerMetodosDePago();
  }

  obtenerMetodosDePago() {
    this.metodoDePagoService.getMetodosDePago().subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: (error) => {
        console.error('Error al obtener métodos de pago:', error);
      }
    });
  }

  eliminarMetodoDePago(id: number) {
    this.metodoDePagoService.deleteMetodoDePago(id).subscribe({
      next: () => {
        this.obtenerMetodosDePago();
      },
      error: (error) => {
        console.error('Error al eliminar método de pago:', error);
      }
    });
  }

  abrirDialogo(metodoDePago?: MetodoPago) {
    /*
    const dialogRef = this.dialog.open(MetodopagoComponent, {
      width: '400px',
      data: metodoDePago || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idmetododepago) {
          this.metodoDePagoService.updateMetodoDePago(result.idmetododepago, result).subscribe({
            next: () => this.obtenerMetodosDePago(),
            error: (error) => console.error('Error al actualizar método de pago:', error)
          });
        } else {
          this.metodoDePagoService.createMetodoDePago(result).subscribe({
            next: () => this.obtenerMetodosDePago(),
            error: (error) => console.error('Error al crear método de pago:', error)
          });
        }
      }
    });*/
  }
}