import { Component, inject, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../interfaces/Usuario';
import { UsuarioService } from '../../services/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosDialogComponent } from './dialog/usuarios-dialog/usuarios-dialog.component';

@Component({
  selector: 'app-usuarios',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  displayedColumns: string[] = ['idusuario', 'correo', 'rol', 'fechaRegistro', 'fechaActualizacion','acciones'];
  dataSource: Usuario[] = [];

  private usuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.getUsers().subscribe({
      next: (data) => {
        this.dataSource = data.map(usuario => ({
          ...usuario,
          fechaRegistro: this.fixDate(usuario.fechaRegistro),
          fechaActualizacion: this.fixDate(usuario.fechaActualizacion)
        }));
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  fixDate(fecha: string): string {
    if (!fecha) return '';
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  eliminarUsuario(id: number) {
    this.usuarioService.deleteUser(id).subscribe({
      next: () => {
        this.obtenerUsuarios();
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
      }
    });
  }

  abrirDialogo(usuarios?: Usuario) {
      const dialogRef = this.dialog.open(UsuariosDialogComponent, {
        data: usuarios || {}
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
      });
    }
}