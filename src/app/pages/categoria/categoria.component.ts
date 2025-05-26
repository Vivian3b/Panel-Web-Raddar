import { Component, inject } from '@angular/core';
import { Categoria } from '../../interfaces/Categoria';
import { CategoriaService } from '../../services/categoria.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaDialogComponent } from './dialog/categoria-dialog/categoria-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { EliminadoComponent } from '../../shared/eliminado/eliminado.component';
import { BusquedaComponent } from '../../shared/busqueda/busqueda.component';

@Component({
  selector: 'app-categoria',
  imports: [SharedModule,
    BusquedaComponent
  ],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {
  displayedColumns: string[] = ['idcategoria', 'nombre', 'idcreador', 'idactualizacion', 'fechacreacion', 'fechaactualizacion', 'acciones'];
  dataSource: Categoria[] = [];
  categoriasOriginales: Categoria[] = [];

  private categoriaService = inject(CategoriaService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        const procesadas = data.map(categoria => ({
          ...categoria,
          fechacreacion: this.fixDate(categoria.fechacreacion),
          fechaactualizacion: this.fixDate(categoria.fechaactualizacion)
        }));
        this.categoriasOriginales = procesadas;
        this.dataSource = [...procesadas];
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });
  }

  filtrarCategorias(texto: string) {
    if (!texto) {
      this.dataSource = [...this.categoriasOriginales];
    } else {
      this.dataSource = this.categoriasOriginales.filter(c =>
        c.nombre.toLowerCase().includes(texto)
      );
    }
  }

  fixDate(fecha: string): string {
    if (!fecha) return '';
    let date = new Date(fecha);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  eliminarCategoria(id: number) {
  const dialogRef = this.dialog.open(EliminadoComponent, {
    width: '350px',
    data: { nombre: 'categoría' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.categoriaService.eliminarCategoria(id).subscribe({
        next: () => this.obtenerCategorias(),
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
        }
      });
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