import { Component, inject, OnInit } from '@angular/core';
import { Matriz } from '../../interfaces/Matriz';
import { MatrizService } from '../../services/matriz.service';
import { MatDialog } from '@angular/material/dialog';
import { MatrizDialogsComponent } from './dialogs/matriz-dialogs/matriz-dialogs.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-matriz',
  imports: [
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    CommonModule
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
      next: (data) => { 
        this.dataSource = data; 
      },
      error: (error) => { 
        console.error('Error al obtener matrices:', error.message); // Mensaje de error más específico
      }
    });
  }

  // Eliminar una matriz
  eliminarMatriz(idmatriz: number) {
    this.matrizService.eliminarMatriz(idmatriz).subscribe({
      next: () => { 
        this.dataSource = this.dataSource.filter(m => m.idmatriz !== idmatriz); 
      },
      error: (error) => { 
        console.error('Error al eliminar matriz:', error.message); // Mensaje de error más específico
      }
    });
  }

  // Abrir el diálogo para crear o editar una matriz
  abrirDialogo(matriz?: Matriz) {
    const dialogRef = this.dialog.open(MatrizDialogsComponent, {
      data: matriz || {}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Verificar si estamos editando una matriz existente
        const index = this.dataSource.findIndex(m => m.idmatriz === result.idmatriz);
        if (index !== -1) {
          // Si existe, actualizar
          this.matrizService.guardarMatriz(result).subscribe({
            next: () => this.obtenerMatrices(),
            error: (error) => console.error('Error al actualizar matriz:', error.message)
          });
        } else {
          // Si no existe, crear
          this.matrizService.guardarMatriz(result).subscribe({
            next: () => this.obtenerMatrices(),
            error: (error) => console.error('Error al crear matriz:', error.message)
          });
        }
      }
    });
  }
}