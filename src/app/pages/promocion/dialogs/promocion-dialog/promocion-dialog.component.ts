import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EmpresaService } from '../../../../services/empresa.service';
import { Empresa } from '../../../../interfaces/Empresa';
import { CategoriaService } from '../../../../services/categoria.service';
import { Categoria } from '../../../../interfaces/Categoria';
import { PromocionService } from '../../../../services/promocion.service';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-promocion-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    SharedModule
  ],
  templateUrl: './promocion-dialog.component.html',
  styleUrls: ['./promocion-dialog.component.css']
})
export class PromocionDialogComponent implements OnInit {
  form: FormGroup;
  empresas: Empresa[] = [];
  categorias: Categoria[] = [];
  tipos: string[] = [];
  imagenes: File[] = [];
  imagenesExistentes: { url: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PromocionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private empresaService: EmpresaService,
    private categoriaService: CategoriaService,
    private promocionService: PromocionService
  ) {
    this.form = this.fb.group({
      idpromocion: [data.idpromocion || null],
      nombre: [data.nombre || ''],
      descripcion: [data.descripcion || ''],
      vigenciainicio: [data.vigenciainicio ? new Date(data.vigenciainicio).toISOString().split('T')[0] : ''],
      vigenciafin: [data.vigenciafin ? new Date(data.vigenciafin).toISOString().split('T')[0] : ''],
      tipo: [data.tipo || null],
      precio: [data.precio || null],
      empresa_idempresa: [data.empresa_idempresa || null],
      categoria_idcategoria: [data.categoria_idcategoria || null],
      eliminado: [data.eliminado || 0]
    });
  }

  ngOnInit(): void {
    this.empresaService.obtenerEmpresas().subscribe({
      next: (empresas: Empresa[]) => this.empresas = empresas,
      error: (error) => console.error('Error al obtener empresas:', error)
    });

    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias: Categoria[]) => this.categorias = categorias,
      error: (error) => console.error('Error al obtener categorías:', error)
    });

    this.tipos = this.promocionService.getTipos();

    if (this.data.imagenes && Array.isArray(this.data.imagenes)) {
      this.imagenesExistentes = this.data.imagenes.map((img: any) => ({ url: img.url }));
    }
  }

  onImageSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    this.imagenes.push(...files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenesExistentes.push({ url: e.target.result }); // Mostrar imagen como preview
      };
      reader.readAsDataURL(file);
    });
  }

  eliminarImagenExistente(index: number): void {
    this.imagenesExistentes.splice(index, 1);
  }

  guardar() {
    const formValue = this.form.value;
    formValue.vigenciainicio = this.toCorrectDateFormat(formValue.vigenciainicio);
    formValue.vigenciafin = this.toCorrectDateFormat(formValue.vigenciafin);

    if (formValue.idpromocion) {
      this.promocionService.updatePromocion(formValue.idpromocion, formValue).subscribe(() => {
        if (this.imagenes.length > 0) {
          this.promocionService.subirImagenes(formValue.idpromocion!, this.imagenes).subscribe();
        }
        this.dialogRef.close(true);
      });
    } else {
      this.promocionService.createPromocion(formValue).subscribe((nueva: any) => {
        if (this.imagenes.length > 0) {
          this.promocionService.subirImagenes(nueva.insertId, this.imagenes).subscribe();
        }
        this.dialogRef.close(true);
      });
    }
  }

  toCorrectDateFormat(fecha: string): string {
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }
}