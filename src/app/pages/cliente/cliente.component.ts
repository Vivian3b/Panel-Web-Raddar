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
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/Usuario';

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
  private usuarioService = inject(UsuarioService); // Inyección del servicio de usuarios
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes() {
    Promise.all([
      this.clienteService.getClientes().toPromise(),
      this.usuarioService.getUsers().toPromise()
    ])
    .then(([cliente, usuario]) => {
      const usuariosCliente = (usuario || [])
        .filter((u: Usuario) => u.rol_idrol === 2)
        .map((u: Usuario) => u.idusuario);


      this.dataSource = (cliente || [])
        .filter((c: Cliente) => usuariosCliente.includes(c.usuario_idusuario))
        .map(cliente => ({
          ...cliente,
          idcliente: cliente.idcliente || 1,
          nombre: cliente.nombre || 'Nombre no disponible',
          telefono: cliente.telefono || 'Teléfono no disponible',
        }));
      
    })
    .catch((error: HttpErrorResponse) => {
      console.error('Error al obtener clientes o usuarios:', error.message);
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