import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EmpresaService } from '../../../../services/empresa.service';
import { Empresa } from '../../../../interfaces/Empresa';
import { CategoriaService } from '../../../../services/categoria.service';
import { Categoria } from '../../../../interfaces/Categoria';
import { PromocionService } from '../../../../services/promocion.service';

@Component({
  selector: 'app-promocion-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './promocion-dialog.component.html',
  styleUrls: ['./promocion-dialog.component.css']
})
export class PromocionDialogComponent implements OnInit{
  form: FormGroup;
  empresas: Empresa[] = [];
  categorias: Categoria[] = [];
  tipos: string[] = []; // Tipos 'Informativa' y 'Venta'

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PromocionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private empresaService: EmpresaService,
    private categoriaService: CategoriaService,
    private promocionService: PromocionService
  ) {
    this.form = this.fb.group({
      idpromocion: [data.idpromocion || null],
      nombre: [data.nombre || ''],
      descripcion: [data.descripcion || ''],
      vigenciainicio: [data.vigenciainicio ? new Date(data.vigenciainicio).toISOString().split('T')[0] : ''],
      vigenciafin: [data.vigenciafin ? new Date(data.vigenciafin).toISOString().split('T')[0] : ''],
      tipo: [data.tipo || null],
      precio: [this.data.precio || null],
      empresa_idempresa: [data.empresa_idempresa || null],
categoria_idcategoria: [data.categoria_idcategoria || null],
      eliminado: [data.eliminado || 0]
    });
  }

  ngOnInit(): void {
    // Llama al método para obtener las empresas
    this.empresaService.obtenerEmpresas().subscribe({
      next: (empresas: Empresa[]) => {
        this.empresas = empresas; // Asigna las empresas obtenidas al arreglo
      },
      error: (error) => {
        console.error('Error al obtener empresas:', error);
      }
    });

    // Obtener categorías
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categorias = categorias; // Asigna las categorías obtenidas
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });

    this.tipos = this.promocionService.getTipos();
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

  cerrarDialogo() {
    this.dialogRef.close();  // Cierra el diálogo manualmente
  }
  
  
  
  
  
}