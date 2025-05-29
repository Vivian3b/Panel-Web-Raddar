import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { jwtDecode } from 'jwt-decode';
import { UsuarioService } from '../../../../services/usuario.service';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-cliente-dialog',
  imports: [SharedModule],
  templateUrl: './cliente-dialog.component.html',
  styleUrl: './cliente-dialog.component.css'
})
export class ClienteDialogComponent {
  form: FormGroup;
  esEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClienteDialogComponent>,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.esEdicion = !!data.idusuario;

    this.form = this.fb.group({
      idusuario: [data.idusuario || null],
      correo: [data.email || '', [Validators.required, Validators.email]],
      cambiarPassword: [!this.esEdicion],
      password: [''],
      confirmarPassword: [''],
      idcreador: [data.idcreador || null],
      fechacreacion: [data.fechacreacion || new Date().toISOString().split('T')[0]],
      fechaactualizacion: [data.fechaactualizacion || null]
    }, { validators: this.passwordsCoinciden });

    this.form.get('cambiarPassword')?.valueChanges.subscribe(valor => {
      const passControl = this.form.get('password');
      const confirmarPassControl = this.form.get('confirmarPassword');

      if (valor) {
        passControl?.setValidators([Validators.required, Validators.minLength(6)]);
        confirmarPassControl?.setValidators([Validators.required]);
      } else {
        passControl?.clearValidators();
        confirmarPassControl?.clearValidators();
        passControl?.setValue('');
        confirmarPassControl?.setValue('');
      }

      passControl?.updateValueAndValidity();
      confirmarPassControl?.updateValueAndValidity();
    });
  }

  passwordsCoinciden(group: AbstractControl) {
    const cambiar = group.get('cambiarPassword')?.value;
    if (!cambiar) return null;

    const pass = group.get('password')?.value || '';
    const confirm = group.get('confirmarPassword')?.value || '';
    return pass === confirm ? null : { noCoinciden: true };
  }
/*
  guardar() {
    if (this.form.invalid) return;

    const formValue = { ...this.form.value };
    const token = localStorage.getItem('token');
    if (!token) return console.error('No se encontró el token JWT');

    const decodedToken: any = jwtDecode(token);
    formValue.idcreador = formValue.idcreador || decodedToken.idusuario;
    formValue.fechaactualizacion = new Date().toISOString().split('T')[0];

    if (!formValue.cambiarPassword) {
      delete formValue.password;
      delete formValue.confirmarPassword;
    }
    delete formValue.cambiarPassword;

    formValue.idrol = 3; // Cliente
    formValue.email = formValue.correo;
    delete formValue.correo;

    if (this.esEdicion) {
      this.usuarioService.updateUser(formValue.idusuario, formValue).subscribe({
        next: (clienteActualizado) => this.dialogRef.close(clienteActualizado),
        error: (error) => console.error(error)
      });
    } else {
      this.usuarioService.createUser(formValue).subscribe({
        next: (respuesta) => {
          this.usuarioService.verifyEmail(respuesta.token).subscribe({
            next: () => console.log('Correo de confirmación enviado'),
            error: (err) => console.error(err)
          });
          this.dialogRef.close(respuesta.usuario);
        },
        error: (error) => console.error('Error al crear cliente:', error)
      });
    }
  }*/

  cerrarDialogo() {
    this.dialogRef.close();
  }
}