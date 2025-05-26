import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Rol } from '../../../../interfaces/Rol';
import { SharedModule } from '../../../../shared/shared.module';
import { TokenService } from '../../../../services/token.service';

@Component({
  selector: 'app-rol-dialog',
  imports: [SharedModule],
  templateUrl: './rol-dialog.component.html',
  styleUrl: './rol-dialog.component.css'
})
export class RolDialogComponent {
  rolForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Rol,
    private tokenService: TokenService
  ) {
    this.rolForm = this.fb.group({
      idrol: [data?.idrol],
      nombre: [data?.nombre || '', Validators.required],
      fechacreacion: [data?.fechacreacion || ''],
      fechaactualizacion: [new Date().toISOString().split('T')[0]]
    });
  }

  guardar() {
    if (this.rolForm.invalid) return;
    const idusuario = this.tokenService.getUserId();

    const rol: Rol = {
          ...this.data,
          ...this.rolForm.value
        };
    
        this.dialogRef.close(rol);
  }

  cancelar() {
    this.dialogRef.close();
  }
}