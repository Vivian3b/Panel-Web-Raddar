import { Component, inject } from '@angular/core';
import { Categoria } from '../../interfaces/Categoria';
import { CategoriaService } from '../../services/categoria.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared/shared.module';
import { CategoriaDialogComponent } from './dialog/categoria-dialog/categoria-dialog.component';

@Component({
  selector: 'app-categoria',
  imports: [SharedModule],
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
    this.categoriaService.obtenerCategorias().subscribe({
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
    this.categoriaService.eliminarCategoria(id).subscribe({
      next: () => this.obtenerCategorias(),
      error: (error) => {
        console.error('Error al eliminar categoría:', error);
      }
    });
  }

  abrirDialogo(categoria?: Categoria) {
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      width: '400px',
      data: categoria || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idcategoria) {
          this.categoriaService.actualizarCategoria(result.idcategoria, result).subscribe({
            next: () => this.obtenerCategorias(),
            error: (error) => console.error('Error al actualizar categoría:', error)
          });
        } else {
          this.categoriaService.crearCategoria(result).subscribe({
            next: () => this.obtenerCategorias(),
            error: (error) => console.error('Error al crear categoría:', error)
          });
        }
      }
    });
  }
}