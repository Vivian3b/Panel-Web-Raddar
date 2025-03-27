import { Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

interface Usuario {
  idusuario: number;
  rol_idrol: number;
  email: string;
  fechacreacion: string;
  estado: boolean;
  fechaactualizacion: string;
}
@Component({
  selector: 'app-usuarios',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  displayedColumns: string[] = ['idusuario', 'rol_idrol', 'email', 'fechacreacion', 'estado', 'fechaactualizacion', 'acciones'];
  dataSource = new MatTableDataSource<Usuario>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.cargarUsuarios();
}
cargarUsuarios() {
  const usuarios: Usuario[] = [
    { idusuario: 1, rol_idrol: 1, email: 'admin@example.com', fechacreacion: '2024-01-01', estado: true, fechaactualizacion: '2024-02-15' },
    { idusuario: 2, rol_idrol: 2, email: 'user@example.com', fechacreacion: '2024-01-10', estado: false, fechaactualizacion: '2024-02-18' },
    { idusuario: 3, rol_idrol: 3, email: 'editor@example.com', fechacreacion: '2024-02-05', estado: true, fechaactualizacion: '2024-02-20' }
  ];
  this.dataSource = new MatTableDataSource(usuarios);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

aplicarFiltro(event: Event) {
  const filtroValor = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filtroValor.trim().toLowerCase();
}
}
