import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../../../../interfaces/Categoria';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-categoria-dialog',
  imports: [SharedModule],
  templateUrl: './categoria-dialog.component.html',
  styleUrl: './categoria-dialog.component.css'
})
export class CategoriaDialogComponent {
  categoriaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoriaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Categoria
  ) {
    this.categoriaForm = this.fb.group({
      idcategoria: [data?.idcategoria],
      nombre: [data?.nombre || '', Validators.required],
      fechacreacion: [data?.fechacreacion || ''],
      fechaactualizacion: [new Date().toISOString().split('T')[0]]
    });
  }

  guardar() {
    if (this.categoriaForm.invalid) return;

    const categoria: Categoria = {
      ...this.data,
      ...this.categoriaForm.value
    };

    this.dialogRef.close(categoria);
  }

  cancelar() {
    this.dialogRef.close();
  }
}