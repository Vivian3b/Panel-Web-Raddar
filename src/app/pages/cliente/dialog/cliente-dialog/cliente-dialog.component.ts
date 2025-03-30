import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cliente } from '../../../../interfaces/Cliente';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cliente-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './cliente-dialog.component.html',
  styleUrl: './cliente-dialog.component.css'
})
export class ClienteDialogComponent {
  form: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<ClienteDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Cliente
    ) {
      this.form = this.fb.group({
        idcliente: [data.idcliente || null],
        usuario_idusuario: [data.usuario_idusuario || null],
        nombre: [data.nombre || ''],
        telefono: [data.telefono || ''],
        ubicacion: this.fb.group({
          lat: [data.ubicacion?.lat || null],
          lng: [data.ubicacion?.lng || null]
        }),
        eliminado: [data.eliminado || 0]
      });
    }
  
    guardar() {
      const formValue = this.form.value;
      this.dialogRef.close(formValue);
    }
    
   
  
    cerrarDialogo() {
      this.dialogRef.close();  // Cierra el diálogo manualmente
    }
    
    
    
    
    
  

}
