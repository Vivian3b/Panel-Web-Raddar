import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import * as L from 'leaflet';
import { EmpresaService } from '../../../../services/empresa.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-empresa-dialog',
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule
  ],
  templateUrl: './empresa-dialog.component.html',
  styleUrl: './empresa-dialog.component.css'
})
export class EmpresaDialogComponent implements AfterViewInit, OnInit {
  form: FormGroup;
  map!: L.Map;
  marker!: L.Marker;
  matrices: any[] = []; // Arreglo para almacenar las matrices disponibles

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmpresaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private empresaService: EmpresaService // Servicio para obtener matrices
  ) {
    this.form = this.fb.group({
      idempresa: [data?.idempresa || null],
      usuario_idusuario: [data?.usuario_idusuario || null],
      matriz_idmatriz: [data?.matriz_idmatriz || null], // Este campo ahora será un select
      nombre: [data?.nombre || ''],
      descripcion: [data?.descripcion || ''],
      ubicacion: [data?.ubicacion ? `${data.ubicacion.x}, ${data.ubicacion.y}` : '']
    });
  }

  ngOnInit(): void {
    this.obtenerMatrices(); // Cargar las matrices al iniciar el componente
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  // Método para obtener las matrices desde la API
  obtenerMatrices(): void {
    this.empresaService.obtenerMatrices().subscribe({
      next: (data: any[]) => {
        this.matrices = data; // Almacenamos las matrices recibidas
      },
      error: (error) => {
        console.error('Error al obtener matrices:', error);
      }
    });
  }

  initializeMap(): void {
    const lat = this.data?.ubicacion?.y || 19.4326;  
    const lng = this.data?.ubicacion?.x || -99.1332;  

    this.map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    
    this.marker = L.marker([lat, lng]).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker.setLatLng(e.latlng);
      this.form.get('ubicacion')?.setValue(`${e.latlng.lat}, ${e.latlng.lng}`);
    });
  }

  guardar() {
    const formValue = this.form.value;
    const latLng = this.marker.getLatLng();
  
    formValue.ubicacion = { x: latLng.lng, y: latLng.lat };
  
    // Asignamos el idusuario si no existe en los datos del formulario
    formValue.usuario_idusuario = 1; // Ajusta según tu lógica para obtener el idusuario
  
    if (formValue.idempresa) {
      // Si ya existe una idempresa, actualizamos
      this.empresaService.actualizarEmpresa(formValue).subscribe({
        next: (empresa) => {
          console.log('Empresa actualizada:', empresa);
          this.dialogRef.close(empresa);
        },
        error: (error) => {
          console.error('Error al actualizar la empresa:', error);
        }
      });
    } else {
      // Si no existe idempresa, creamos una nueva
      this.empresaService.crearEmpresa(formValue).subscribe({
        next: (empresa) => {
          console.log('Empresa creada:', empresa);
          this.dialogRef.close(empresa);
        },
        error: (error) => {
          console.error('Error al crear la empresa:', error);
        }
      });
    }
  }
  
  
  cerrarDialogo() {
    this.dialogRef.close();
  }
}