import { Component, inject, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../interfaces/Usuario';
import { UsuarioService } from '../../services/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosDialogComponent } from './dialog/usuarios-dialog/usuarios-dialog.component';
import { jwtDecode } from 'jwt-decode';
import { RolService } from '../../services/rol.service';
import { SolicitarCambioComponent } from '../password/solicitar-cambio/solicitar-cambio.component';
import { BusquedaComponent } from '../../shared/busqueda/busqueda.component';
import { EliminadoComponent } from '../../shared/eliminado/eliminado.component';


@Component({
  selector: 'app-usuarios',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    BusquedaComponent
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  displayedColumns: string[] = ['idusuario', 'correo', 'rol', 'fechaCreacion', 'fechaActualizacion', 'idcreador','idactualizacion','estatus','acciones'];
  dataSource: Usuario[] = [];


  dataSourceFiltrada: Usuario[] = [];  // <-- lista filtrada para mostrar
    filtroTexto: string = '';
  rolesMap: { [key: number]: string } = {};

  private usuarioService = inject(UsuarioService);
  private rolService = inject(RolService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerRoles();
  }

  obtenerRoles() {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        roles.forEach((rol: any) => {
          this.rolesMap[rol.idrol] = rol.nombre;
        });
        this.obtenerUsuarios();
      },
      error: (error) => {
        console.error('Error al obtener roles:', error);
        this.obtenerUsuarios();
      }
    });
  }

  obtenerUsuarios() {
    this.usuarioService.getUsers().subscribe({
      next: (data) => {
        const usuariosFiltrados = data.filter(usuario =>
          usuario.rol_idrol === 1 || usuario.rol_idrol === 3
        );

        this.dataSource = usuariosFiltrados.map(usuario => ({
          ...usuario,
          rol: this.rolesMap[usuario.rol_idrol] || 'Desconocido',
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
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  aplicarFiltro() {
    if (!this.filtroTexto) {
      this.dataSourceFiltrada = [...this.dataSource];
    } else {
      const filtro = this.filtroTexto.toLowerCase();
      this.dataSourceFiltrada = this.dataSource.filter(usuario =>
        Object.values(usuario).some(valor =>
          valor?.toString().toLowerCase().includes(filtro)
        )
      );
    }
  }

  onFiltroTextoChange(texto: string) {
    this.filtroTexto = texto;
    this.aplicarFiltro();
  }


  fixDate(fecha: string): string {
    if (!fecha) return '';
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  eliminarUsuario(id: number) {
  const usuario = this.dataSource.find(u => u.idusuario === id);

  const dialogRef = this.dialog.open(EliminadoComponent, {
    width: '350px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.usuarioService.deleteUser(id).subscribe({
        next: () => {
          this.obtenerUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  });
}


  abrirDialogo() {
    const token = localStorage.getItem('token');
    const decodedToken: any = token ? jwtDecode(token) : null;

    const dialogRef = this.dialog.open(UsuariosDialogComponent, {
      data: { idcreador: decodedToken?.idusuario || null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerUsuarios();
      }
    });
  }

  abrirDialogoCambioPassword(email: string) {
    const dialogRef = this.dialog.open(SolicitarCambioComponent, {
      data: { email }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Correo para cambio de contraseña enviado.');
      }
    });
  }
}
