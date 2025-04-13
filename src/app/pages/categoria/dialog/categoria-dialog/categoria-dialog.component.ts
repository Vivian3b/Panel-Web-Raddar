import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../../../../interfaces/Categoria';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from '../../../../services/categoria.service';
import { SharedModule } from '../../../../shared/shared/shared.module';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-categoria-dialog',
  imports: [SharedModule],
  templateUrl: './categoria-dialog.component.html',
  styleUrl: './categoria-dialog.component.css'
})
export class CategoriaDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoriaDialogComponent>,
    private categoriaService: CategoriaService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      idcategoria: [data?.idcategoria || null],
      nombre: [data?.nombre || '', Validators.required],
      idcreador: [data?.idcreador || null],
      idactualizacion: [null],
      fechacreacion: [data?.fechacreacion || null],
      fechaactualizacion: [null],
      eliminado: [data?.eliminado ?? 0]
    });
  }

  guardar() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const token = localStorage.getItem('token');

      if (token) {
        const decoded: any = jwtDecode(token);
        const userId = decoded.id;

        const ahora = new Date().toISOString().split('T')[0];

        if (formValue.idcategoria) {
          // Editar categoría existente
          formValue.idactualizacion = userId;
          formValue.fechaactualizacion = ahora;

          this.categoriaService.actualizarCategoria(formValue.idcategoria, formValue).subscribe({
            next: (res) => {
              console.log('Categoría actualizada:', res);
              this.dialogRef.close(res);
            },
            error: (err) => console.error('Error actualizando categoría:', err)
          });
        } else {
          // Crear nueva categoría
          formValue.idcreador = userId;
          formValue.fechacreacion = ahora;

          this.categoriaService.crearCategoria(formValue).subscribe({
            next: (res) => {
              console.log('Categoría creada:', res);
              this.dialogRef.close(res);
            },
            error: (err) => console.error('Error creando categoría:', err)
          });
        }
      }
    }
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }
}