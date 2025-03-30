import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Matriz } from '../../../../interfaces/Matriz';
import { MatrizService } from '../../../../services/matriz.service';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-matriz-dialog',
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './matriz-dialog.component.html',
  styleUrl: './matriz-dialog.component.css'
})
export class MatrizDialogComponent {
  form: FormGroup;
  map!: L.Map;
  marker!: L.Marker;
  matrizData: Matriz;
  coordenadas: { lat: number, lng: number } = { lat: 0, lng: 0 };  // Coordenadas a mostrar

  constructor(
    public dialogRef: MatDialogRef<MatrizDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Matriz,
    private fb: FormBuilder,
    private matrizService: MatrizService
  ) {
    this.matrizData = data || { idmatriz: 0, nombre: '', ubicacion: { x: 0, y: 0 }, telefono: '', email: '', eliminado: 0 };
    this.form = this.fb.group({
      nombre: [this.matrizData.nombre, Validators.required],
      telefono: [this.matrizData.telefono, Validators.required],
      email: [this.matrizData.email, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.initializeMap();  // Inicializamos el mapa aquí
  }

  // Inicializar el mapa
  initializeMap(): void {
    this.map = L.map('map').setView([this.matrizData.ubicacion.x, this.matrizData.ubicacion.y], 13);
    
    // Usar OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Crear el marcador inicial
    this.marker = L.marker([this.matrizData.ubicacion.x, this.matrizData.ubicacion.y], { draggable: true }).addTo(this.map);

    // Cuando el marcador se mueve, actualizamos las coordenadas
    this.marker.on('dragend', (event) => {
      const latLng = event.target.getLatLng();
      this.coordenadas = { lat: latLng.lat, lng: latLng.lng };  // Actualizamos las coordenadas
      this.form.patchValue({
        ubicacion: {
          x: latLng.lat,
          y: latLng.lng
        }
      });
    });
  }

  // Guardar la matriz
  guardarMatriz(): void {
    // Recoger los datos del formulario
    const updatedMatriz = {
      ...this.matrizData,
      ...this.form.value,
      ubicacion: {
        x: this.coordenadas.lat,  // Usamos las coordenadas actualizadas
        y: this.coordenadas.lng
      }
    };

    // Llamada al servicio para guardar la matriz
    this.matrizService.guardarMatriz(updatedMatriz).subscribe({
      next: () => this.dialogRef.close(updatedMatriz),  // Cerrar el diálogo al guardar
      error: (err) => console.error('Error al guardar matriz:', err),
    });
  }

  // Cerrar el diálogo
  cerrar(): void {
    this.dialogRef.close();
  }
}