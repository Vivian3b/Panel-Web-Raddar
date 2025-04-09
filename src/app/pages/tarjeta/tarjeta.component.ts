import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Tarjeta } from '../../interfaces/Tarjeta';
import { TarjetaService } from '../../services/tarjeta.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tarjeta',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './tarjeta.component.html',
  styleUrl: './tarjeta.component.css'
})
export class TarjetaComponent implements OnInit{
  displayedColumns: string[] = ['idtarjeta', 'metododepago_idmetododepago', 'numero', 'nombrecliente', 'fechaexpiracion', 'acciones'];
  dataSource: Tarjeta[] = [];

  private tarjetaService = inject(TarjetaService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas() {
    this.tarjetaService.getTarjetas().subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: (error) => {
        console.error('Error al obtener tarjetas:', error);
      }
    });
  }

  eliminarTarjeta(id: number) {
    this.tarjetaService.deleteTarjeta(id).subscribe({
      next: () => {
        this.obtenerTarjetas();
      },
      error: (error) => {
        console.error('Error al eliminar tarjeta:', error);
      }
    });
  }

  abrirDialogo(tarjeta?: Tarjeta) {
    /*const dialogRef = this.dialog.open(TarjetaDialogComponent, {
      width: '400px',
      data: tarjeta || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idtarjeta) {
          this.tarjetaService.updateTarjeta(result.idtarjeta, result).subscribe({
            next: () => this.obtenerTarjetas(),
            error: (error) => console.error('Error al actualizar tarjeta:', error)
          });
        } else {
          this.tarjetaService.createTarjeta(result).subscribe({
            next: () => this.obtenerTarjetas(),
            error: (error) => console.error('Error al crear tarjeta:', error)
          });
        }
      }
    });*/
  }
}
