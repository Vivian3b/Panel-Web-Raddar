import { Component, Inject} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-empresas-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './empresas-dialog.component.html',
  styleUrl: './empresas-dialog.component.css'
})
export class EmpresasDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmpresasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      idempresa: [data.idempresa || null],
      nombre: [data.nombre || ''],
      descripcion: [data.descripcion || ''],
      ubicacion_x: [data.ubicacion?.x || null],
      ubicacion_y: [data.ubicacion?.y || null],
      usuario_idusuario: [data.usuario_idusuario || 1],
      matriz_idmatriz: [data.matriz_idmatriz || 1],
      eliminado: [data.eliminado || 0]
    });
  }

  guardar() {
    const formValue = this.form.value;

    // Ajustar el formato de ubicación si es necesario
    const empresaData = {
      ...formValue,
      ubicacion: {
        x: formValue.ubicacion_x,
        y: formValue.ubicacion_y
      }
    };
    
    delete empresaData.ubicacion_x;
    delete empresaData.ubicacion_y;

    this.dialogRef.close(empresaData);
  }
}