import { Component, inject, OnInit } from '@angular/core';
import { Matriz } from '../../interfaces/Matriz';
import { MatrizService } from '../../services/matriz.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatrizDialogComponent } from './dialog/matriz-dialog/matriz-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EliminadoComponent } from '../../shared/eliminado/eliminado.component';
import { BusquedaComponent } from '../../shared/busqueda/busqueda.component';

@Component({
  selector: 'app-matriz',
  imports: [
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    CommonModule,
    MatDialogModule,
    BusquedaComponent
  ],
  templateUrl: './matriz.component.html',
  styleUrl: './matriz.component.css'
})
export class MatrizComponent implements OnInit{
  displayedColumns: string[] = ['idmatriz','nombre', 'ubicacion', 'telefono', 'email', 'acciones'];
  dataSource: Matriz[] = [];

  todasLasMatrices: Matriz[] = []; 
  textoBusqueda: string = ''; 

  private matrizService = inject(MatrizService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerMatrices();
  }

  obtenerMatrices() {
    this.matrizService.getMatrices().subscribe({
      next: (data) => {
        this.todasLasMatrices = data; // ✅ guardar todas las matrices
        this.aplicarFiltro(); // ✅ aplicar filtro inicial
      },
      error: (error) => {
        console.error('Error al obtener matrices:', error);
      }
    });
  }

  aplicarFiltro() {
    const filtro = this.textoBusqueda.toLowerCase();
    this.dataSource = this.todasLasMatrices.filter(m =>
      m.nombre.toLowerCase().includes(filtro) ||
      m.telefono.toLowerCase().includes(filtro) ||
      m.email.toLowerCase().includes(filtro)
    );
  }

  onTextoBusquedaCambio(texto: string) {
    this.textoBusqueda = texto;
    this.aplicarFiltro();
  }

  confirmarEliminacion(matriz: Matriz) {
  const dialogRef = this.dialog.open(EliminadoComponent, {
    width: '350px',
    data: { nombre: matriz.nombre }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.matrizService.eliminarMatriz(matriz.idmatriz).subscribe({
        next: () => this.obtenerMatrices(),
        error: (error) => console.error('Error al eliminar empresa:', error)
      });
    }
  });
}

  abrirDialogo(matriz?: Matriz) {
    const dialogRef = this.dialog.open(MatrizDialogComponent, {
      width: '400px',
      data: matriz || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idmatriz) {
          this.matrizService.guardarMatriz(result).subscribe({
            next: () => this.obtenerMatrices(),
            error: (error) => console.error('Error al actualizar matriz:', error)
          });
        } else {
          this.matrizService.crearMatriz(result).subscribe({
            next: () => this.obtenerMatrices(),
            error: (error) => console.error('Error al crear matriz:', error)
          });
        }
      }
    });
  }

  // Función para formatear la ubicación de la matriz y mostrar las coordenadas
  getUbicacion(ubicacion: any): string {
    if (ubicacion && ubicacion.lat && ubicacion.lng) {
      return `Lat: ${ubicacion.lat}, Lng: ${ubicacion.lng}`;
    }
    return 'Ubicación no disponible';
  }
}