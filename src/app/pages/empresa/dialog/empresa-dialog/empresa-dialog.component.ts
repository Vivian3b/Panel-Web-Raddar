import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpresaService } from '../../../../services/empresa.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-empresa-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './empresa-dialog.component.html',
  styleUrl: './empresa-dialog.component.css'
})
export class EmpresaDialogComponent {
  form: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<EmpresaDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private empresaService: EmpresaService  // Inyecta el servicio aquí
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
  
      // Llamar al servicio para actualizar la empresa (PATCH)
      this.empresaService.actualizarEmpresa(empresaData).subscribe({
        next: () => {
          this.dialogRef.close(empresaData); // Cierra el diálogo y pasa los datos actualizados
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al guardar la empresa:', error);
        }
      });
    }
}
