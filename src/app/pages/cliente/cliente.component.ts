import { Component, inject, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/Cliente';
import { MatDialog } from '@angular/material/dialog';
import { ClienteDialogComponent } from './dialog/cliente-dialog/cliente-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cliente',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit {
  displayedColumns: string[] = ['idcliente', 'nombre', 'telefono', 'acciones'];
  dataSource: Cliente[] = [];

  private clienteService = inject(ClienteService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data: Cliente[]) => {
        this.dataSource = data.map(cliente => ({
          ...cliente,
          idcliente: cliente.idcliente || 1,
          nombre: cliente.nombre || 'Nombre no disponible',
          telefono: cliente.telefono || 'Teléfono no disponible',
        }));
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error en la solicitud:', error.message);
      }
    });
  }

  eliminarCliente(id: number) {
    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        this.obtenerClientes();
      },
      error: (error) => {
        console.error('Error al eliminar cliente:', error);
      }
    });
  }

  abrirDialogo(cliente?: Cliente) {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '400px',
      data: cliente || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idcliente) {
          this.clienteService.updateCliente(result.idcliente, result).subscribe({
            next: () => this.obtenerClientes(),
            error: (error) => console.error('Error al actualizar cliente:', error)
          });
        } else {
          this.clienteService.createCliente(result).subscribe({
            next: () => this.obtenerClientes(),
            error: (error) => console.error('Error al crear cliente:', error)
          });
        }
      }
    });
  }
}