import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDialogActions } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-usuarios-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule],
  templateUrl: './usuarios-dialog.component.html',
  styleUrl: './usuarios-dialog.component.css'
})
export class UsuariosDialogComponent {
  roles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Cliente' },
  ];

  form: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuariosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      idusuario: [data.idusuario || null],
      email: [data.email || '', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      rol_idrol: [data.rol_idrol || 1, Validators.required],
      idcreador: [data.idcreador || null],
      fechacreacion: [data.fechacreacion || new Date().toISOString().split('T')[0]],
      fechaactualizacion: [data.fechaactualizacion || null],
    });
  }

  guardar() {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      // Obtener el token JWT desde el localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        // Decodificar el token para obtener el id del creador (idcreador)
        const decodedToken: any = jwtDecode(token);
        const idcreador = decodedToken.id; // Asegúrate de que el token contiene el id del usuario autenticado
        
        // Asignar el idcreador al formulario (si no está ya asignado)
        formValue.idcreador = formValue.idcreador || idcreador;

        // Si hay actualización, establecer fecha
        formValue.fechaactualizacion = new Date().toISOString().split('T')[0];

        // Cierra el diálogo y pasa los valores del formulario
        this.dialogRef.close(formValue);
      } else {
        console.error('No se encontró el token JWT');
      }
    }
  }

  cerrarDialogo() {
    this.dialogRef.close();  // Cierra el diálogo sin guardar
  }
}