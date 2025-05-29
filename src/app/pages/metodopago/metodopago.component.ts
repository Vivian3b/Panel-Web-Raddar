import { Component, inject, OnInit } from '@angular/core';
import { MetodoPago } from '../../interfaces/Metodopago';
import { MetodopagoService } from '../../services/metodopago.service';
import { MatDialog } from '@angular/material/dialog';
import { EliminadoComponent } from '../../shared/eliminado/eliminado.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-metodopago',
  imports: [
    SharedModule
  ],
  templateUrl: './metodopago.component.html',
  styleUrl: './metodopago.component.css'
})
export class MetodopagoComponent implements OnInit{
  displayedColumns: string[] = ['idmetododepago', 'cliente_idcliente', 'tipo', 'acciones'];
  dataSource: MetodoPago[] = [];
  dataSourceFiltrada: MetodoPago[] = [];

  private metodoDePagoService = inject(MetodopagoService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerMetodosDePago();
  }

  obtenerMetodosDePago() {
    this.metodoDePagoService.getMetodosDePago().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.dataSourceFiltrada = data;
      },
      error: (error) => {
        console.error('Error al obtener métodos de pago:', error);
      }
    });
  }

  aplicarFiltro(filtro: string) {
    const texto = filtro.toLowerCase();
  this.dataSource = this.dataSourceFiltrada.filter(metodo =>
    metodo.tipo.toLowerCase().includes(texto) ||
    metodo.idmetododepago.toString().includes(texto) ||
    metodo.cliente_idcliente.toString().includes(texto)
  );
  }

  eliminarMetodoDePago(id: number) {
    const dialogRef = this.dialog.open(EliminadoComponent, {
      width: '350px',
      data: { nombre: 'este método de pago' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.metodoDePagoService.deleteMetodoDePago(id).subscribe({
          next: () => {
            this.obtenerMetodosDePago();
          },
          error: (error) => {
            console.error('Error al eliminar método de pago:', error);
          }
        });
      }
    });
  }
}