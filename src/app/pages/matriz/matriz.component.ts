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

@Component({
  selector: 'app-matriz',
  imports: [
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './matriz.component.html',
  styleUrl: './matriz.component.css'
})
export class MatrizComponent implements OnInit{
  displayedColumns: string[] = ['nombre', 'ubicacion', 'telefono', 'email', 'acciones'];
  dataSource: Matriz[] = [];

  private matrizService = inject(MatrizService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerMatrices();
  }

  // Obtener matrices
  obtenerMatrices() {
    this.matrizService.getMatrices().subscribe({
      next: (data: Matriz[]) => { 
        this.dataSource = data; 
      },
      error: (error: any) => { 
        console.error('Error al obtener matrices:', error.message); 
      }
    });
  }

  // Eliminar una matriz
  eliminarMatriz(idmatriz: number) {
    this.matrizService.eliminarMatriz(idmatriz).subscribe({
      next: () => { 
        this.dataSource = this.dataSource.filter(m => m.idmatriz !== idmatriz); 
      },
      error: (error: any) => { 
        console.error('Error al eliminar matriz:', error.message); 
      }
    });
  }

  // Abrir el diálogo para crear o editar una matriz
  abrirDialogo(matriz?: Matriz) {
    const dialogRef = this.dialog.open(MatrizDialogComponent, {
      data: matriz || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.findIndex(m => m.idmatriz === result.idmatriz);
        if (index !== -1) {
          // Actualizar
          this.matrizService.guardarMatriz(result).subscribe({
            next: () => this.obtenerMatrices(),
            error: (error: any) => console.error('Error al actualizar matriz:', error.message)
          });
        } else {
          // Crear
          this.matrizService.guardarMatriz(result).subscribe({
            next: () => this.obtenerMatrices(),
            error: (error: any) => console.error('Error al crear matriz:', error.message)
          });
        }
      }
    });
  }
}