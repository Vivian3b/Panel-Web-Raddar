import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-cambiar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './cambiar.component.html',
  styleUrl: './cambiar.component.css'
})
export class CambiarComponent {
  form: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required]
    }, { validators: this.passwordsCoinciden });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  passwordsCoinciden(group: AbstractControl) {
    const pass = group.get('password')?.value || '';
    const confirm = group.get('confirmarPassword')?.value || '';
    return pass === confirm ? null : { noCoinciden: true };
  }

  cambiarPassword() {
    if (this.form.invalid || !this.token) return;

    const nuevaPassword = this.form.value.password;

    this.usuarioService.cambiarPassword(this.token, nuevaPassword).subscribe({
      next: () => alert('Contraseña actualizada correctamente.'),
      error: (err) => {
        console.error(err);
        alert('Error al actualizar contraseña. Token inválido o expirado.');
      }
    });
  }
}
