import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { jwtDecode } from 'jwt-decode';
import { Usuario } from '../../../../interfaces/Usuario';
import { UsuarioService } from '../../../../services/usuario.service';
import { Rol } from '../../../../interfaces/Rol';
import { RolService } from '../../../../services/rol.service';

import { MatDialog } from '@angular/material/dialog';// ajusta ruta si es necesario
import { ConfirmarDialogComponent } from '../../../confirmar-dialog/confirmar-dialog.component';


@Component({
  selector: 'app-usuarios-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './usuarios-dialog.component.html',
  styleUrls: ['./usuarios-dialog.component.css']
})
export class UsuariosDialogComponent {
  roles: Rol[] = [];
  form: FormGroup;
  esEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuariosDialogComponent>,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      idusuario: [data.idusuario || null],
      correo: [data.email || '', [Validators.required, Validators.email]],
      password: [''],
      confirmarPassword: [''],
      rol_idrol: [data.rol_idrol || null, Validators.required],
      idcreador: [data.idcreador || null],
      fechacreacion: [data.fechacreacion || new Date().toISOString().split('T')[0]],
      fechaactualizacion: [data.fechaactualizacion || null]
    }, { validators: this.passwordsCoinciden });

    this.cargarRoles();
  }

  cargarRoles() {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        // Solo mostrar roles Administrador (idrol=1) y Vendedor (idrol=3)
        this.roles = roles.filter(r => r.idrol === 1 || r.idrol === 3);
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        alert('No se pudieron cargar los roles. Revisa la consola para más detalles.');
      }
    });
  }

  passwordsCoinciden(group: AbstractControl) {
    const pass = group.get('password')?.value || '';
    const confirm = group.get('confirmarPassword')?.value || '';
    return pass === confirm ? null : { noCoinciden: true };
  }

  guardar() {
    if (this.form.invalid) return;

    const formValue = { ...this.form.value };
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró el token JWT');
      return;
    }

    const decodedToken: any = jwtDecode(token);
    formValue.idcreador = formValue.idcreador || decodedToken.idusuario;
    formValue.fechaactualizacion = new Date().toISOString().split('T')[0];

    // Ajustes para la API
    formValue.idrol = formValue.rol_idrol;
    delete formValue.rol_idrol;

    formValue.email = formValue.correo;
    delete formValue.correo;

    this.usuarioService.crearAdministrador(formValue).subscribe({
      next: (respuesta) => {
        this.usuarioService.verifyEmail(respuesta.token).subscribe({
          next: () => console.log('Correo de confirmación enviado'),
          error: (err) => console.error(err)
        });
        this.dialogRef.close(respuesta.usuario);
        this.dialog.open(ConfirmarDialogComponent, {
          width: '350px'
        });

      },
      error: (error) => console.error('Error al crear usuario:', error)
    });
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }
}