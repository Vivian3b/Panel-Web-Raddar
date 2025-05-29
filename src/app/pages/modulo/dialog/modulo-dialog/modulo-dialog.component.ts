import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { PermisoService } from '../../../../services/permiso.service';
import { RolService } from '../../../../services/rol.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-modulo-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './modulo-dialog.component.html',
  styleUrl: './modulo-dialog.component.css'
})
export class ModuloDialogComponent implements OnInit {
  form: FormGroup;
  permisos: any[] = [];
  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private permisoService: PermisoService,
    private rolService: RolService,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ModuloDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      idmodulo: [data.idmodulo || null],
      permiso_idpermiso: [data.permiso_idpermiso || '', Validators.required],
      rol_idrol: [data.rol_idrol || '', Validators.required],
      idcreador: [data.idcreador || null],
      idactualizacion: [data.idactualizacion || null],
      eliminado: [data.eliminado ?? false],
      fechacreacion: [data.fechacreacion || null],
      fechaactualizacion: [data.fechaactualizacion || null]
    });
  }

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarRoles();
  }

  cargarPermisos(): void {
    this.permisoService.getPermisos().subscribe({
      next: (data) => this.permisos = data,
      error: (err) => console.error('Error al cargar permisos', err)
    });
  }

  cargarRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('Error al cargar roles', err)
    });
  }

  guardar() {
    const formValue = this.form.value;
    this.dialogRef.close(formValue);
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }
}