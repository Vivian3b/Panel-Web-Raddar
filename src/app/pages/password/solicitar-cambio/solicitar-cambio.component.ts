import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PasswordService } from '../../../services/password.service';

@Component({
  selector: 'app-solicitar-cambio',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './solicitar-cambio.component.html',
  styleUrl: './solicitar-cambio.component.css'
})
export class SolicitarCambioComponent {
  email: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { email: string },
    private passwordService: PasswordService,
    private dialogRef: MatDialogRef<SolicitarCambioComponent>
  ) {
    this.email = data.email;
  }

  aceptar() {
    this.passwordService.solicitarCambioPassword(this.email).subscribe({
      next: () => {
        alert('Se ha enviado un correo para restablecer la contraseña.');
        this.dialogRef.close(true);
      },
      error: () => {
        alert('No se pudo enviar el correo. Intenta más tarde.');
      }
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}