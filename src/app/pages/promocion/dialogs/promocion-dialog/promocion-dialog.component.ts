import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-promocion-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './promocion-dialog.component.html',
  styleUrls: ['./promocion-dialog.component.css']
})
export class PromocionDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PromocionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      idpromocion: [data.idpromocion || null],
      nombre: [data.nombre || ''],
      descripcion: [data.descripcion || ''],
      vigenciainicio: [data.vigenciainicio ? new Date(data.vigenciainicio).toISOString().split('T')[0] : ''],
      vigenciafin: [data.vigenciafin ? new Date(data.vigenciafin).toISOString().split('T')[0] : ''],
      tipo: [data.tipo || ''],
      precio: [data.precio || null],
      empresa_idempresa: [data.empresa_idempresa || 1],
      categoria_idcategoria: [data.categoria_idcategoria || 1],
      eliminado: [data.eliminado || 0]
    });
    
  }

  guardar() {
    const formValue = this.form.value;
  
    // Convierte las fechas a formato 'YYYY-MM-DD'
    if (formValue.vigenciainicio) {
      formValue.vigenciainicio = this.toCorrectDateFormat(formValue.vigenciainicio);
    }
    if (formValue.vigenciafin) {
      formValue.vigenciafin = this.toCorrectDateFormat(formValue.vigenciafin);
    }
  
    this.dialogRef.close(formValue);
  }
  
  // Función para convertir la fecha a formato 'YYYY-MM-DD' sin modificar la zona horaria
  toCorrectDateFormat(fecha: string): string {
    const date = new Date(fecha);
    // Asegura que se guarde en formato 'YYYY-MM-DD'
    return date.toISOString().split('T')[0];
  }
  
  
  
  
}
