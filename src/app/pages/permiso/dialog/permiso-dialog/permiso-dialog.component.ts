import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Permiso } from '../../../../interfaces/Permiso';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-permiso-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './permiso-dialog.component.html',
  styleUrl: './permiso-dialog.component.css'
})
export class PermisoDialogComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PermisoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Permiso>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      idpermiso: [data.idpermiso ?? null],
      nombre: [data.nombre ?? '', Validators.required],
      idcreador: [data.idcreador ?? null],
      idactualizacion: [data.idactualizacion ?? null],
      fechacreacion: [data.fechacreacion ?? null],
      fechaactualizacion: [data.fechaactualizacion ?? null],
      eliminado: [data.eliminado ?? false],
    });
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }

}
