import { Component, inject, OnInit } from '@angular/core';
import { Cliente } from '../../interfaces/Cliente';
import { MatDialog } from '@angular/material/dialog';
import { ClienteDialogComponent } from './dialog/cliente-dialog/cliente-dialog.component';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/Usuario';
import { jwtDecode } from 'jwt-decode';
import { EliminadoComponent } from '../../shared/eliminado/eliminado.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-cliente',
  imports: [SharedModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit {
  displayedColumns: string[] = ['idusuario', 'correo', 'rol', 'fechaCreacion', 'fechaActualizacion', 'idcreador','idactualizacion','estatus','acciones'];
  dataSource: Cliente[] = [];
  dataSourceFiltrada: Cliente[] = []; 
  filtroTexto: string = '';

  private usuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.usuarioService.getUsers().subscribe({
      next: (data) => {
        const soloClientes = data.filter(usuario => usuario.rol_idrol === 2);
        this.dataSource = soloClientes.map(usuario => ({
          ...usuario,
          rol: 'Cliente',
          fechaCreacion: this.fixDate(usuario.fechacreacion),
          fechaActualizacion: this.fixDate(usuario.fechaactualizacion),
          idcreador: usuario.idcreador,
          idactualizacion: usuario.idactualizacion,
          estatus: usuario.estatus,
          estatusDisplay: usuario.estatus === 1 ? 'Verificado' : 'No verificado'
        } as Usuario));
        this.aplicarFiltro();
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }

  fixDate(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  eliminarCliente(id: number) {
    const dialogRef = this.dialog.open(EliminadoComponent, {
      data: { mensaje: '¿Estás seguro de que deseas eliminar este cliente?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioService.deleteUser(id).subscribe({
          next: () => this.obtenerClientes(),
          error: (error) => console.error('Error al eliminar cliente:', error)
        });
      }
    });
  }

  abrirDialogo(cliente?: Cliente) {
    const token = localStorage.getItem('token');
    let idcreador = null;
    if (token) {
      const decodedToken: any = jwtDecode(token);
      idcreador = decodedToken.idusuario;
    }

    const clienteConIdCreador = cliente ? { ...cliente, idcreador } : { idcreador };
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      data: clienteConIdCreador
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.findIndex(emp => emp.idusuario === result.idusuario);
        if (index !== -1) {
          this.dataSource[index] = result;
        } else {
          this.dataSource.push(result);
        }
        this.dataSource = [...this.dataSource];
      }
      this.aplicarFiltro();
    });
  }

  // Método para aplicar filtro a la dataSource y guardar en dataSourceFiltrada
  aplicarFiltro() {
    if (!this.filtroTexto) {
      this.dataSourceFiltrada = [...this.dataSource];
    } else {
      const filtro = this.filtroTexto.toLowerCase();
      this.dataSourceFiltrada = this.dataSource.filter(cliente =>
        Object.values(cliente).some(valor =>
          valor?.toString().toLowerCase().includes(filtro)
        )
      );
    }
  }

  // Método para capturar el texto de búsqueda emitido desde BusquedaComponent
  onFiltroTextoChange(texto: string) {
    this.filtroTexto = texto;
    this.aplicarFiltro();
  }
}