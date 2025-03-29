import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-matriz-dialogs',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './matriz-dialogs.component.html',
  styleUrl: './matriz-dialogs.component.css'
})
export class MatrizDialogsComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MatrizDialogsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      idmatriz: [data.idmatriz || null],
      nombre: [data.nombre || ''],
      ubicacion_x: [data.ubicacion?.x || null],
      ubicacion_y: [data.ubicacion?.y || null],
      telefono: [data.telefono || ''],
      email: [data.email || ''],
      eliminado: [data.eliminado || 0]
    });
  }

  // Guardar los datos del formulario
  guardar() {
    const formValue = this.form.value;
    const matrizData = {
      ...formValue,
      ubicacion: { x: formValue.ubicacion_x, y: formValue.ubicacion_y }
    };
    delete matrizData.ubicacion_x;
    delete matrizData.ubicacion_y;

    this.dialogRef.close(matrizData);
  }
}