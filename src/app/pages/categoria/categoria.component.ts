import { Component, inject } from '@angular/core';
import { Categoria } from '../../interfaces/Categoria';
import { CategoriaService } from '../../services/categoria.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {
  displayedColumns: string[] = ['idcategoria', 'nombre', 'idcreador', 'idactualizacion', 'fechacreacion', 'fechaactualizacion', 'acciones'];
  dataSource: Categoria[] = [];

  private categoriaService = inject(CategoriaService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.dataSource = data.map(categoria => ({
          ...categoria,
          fechacreacion: this.fixDate(categoria.fechacreacion),
          fechaactualizacion: this.fixDate(categoria.fechaactualizacion)
        }));
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });
  }

  fixDate(fecha: string): string {
    if (!fecha) return '';
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  eliminarCategoria(id: number) {
    this.categoriaService.deleteCategoria(id).subscribe({
      next: () => this.obtenerCategorias(),
      error: (error) => {
        console.error('Error al eliminar categoría:', error);
      }
    });
  }

  abrirDialogo(categoria?: Categoria) {
    /*
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      width: '400px',
      data: categoria || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idcategoria) {
          this.categoriaService.updateCategoria(result.idcategoria, result).subscribe({
            next: () => this.obtenerCategorias(),
            error: (error) => console.error('Error al actualizar categoría:', error)
          });
        } else {
          this.categoriaService.createCategoria(result).subscribe({
            next: () => this.obtenerCategorias(),
            error: (error) => console.error('Error al crear categoría:', error)
          });
        }
      }
    });*/
  }
}