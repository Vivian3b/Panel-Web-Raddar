import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Matriz } from '../../../../interfaces/Matriz';
import { MatrizService } from '../../../../services/matriz.service';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-matriz-dialog',
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './matriz-dialog.component.html',
  styleUrl: './matriz-dialog.component.css'
})
export class MatrizDialogComponent implements OnInit{
  form: FormGroup;
  map!: L.Map;
  marker!: L.Marker;
  matrizData: Matriz;
  coordenadas: { lat: number, lng: number } = { lat: 0, lng: 0 };  // Coordenadas iniciales

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
      latitud: [this.matrizData.ubicacion.y, Validators.required],  // Asignar coordenadas ya existentes
      longitud: [this.matrizData.ubicacion.x, Validators.required] // Asignar coordenadas ya existentes
    });
  }

  ngOnInit(): void {
    this.initializeMap();
    this.form.get('latitud')?.valueChanges.subscribe(lat => this.marker.setLatLng([lat, this.form.get('longitud')?.value]));
    this.form.get('longitud')?.valueChanges.subscribe(lng => this.marker.setLatLng([this.form.get('latitud')?.value, lng]));
  }

  initializeMap(): void {
    // Inicializar el mapa con las coordenadas existentes
    this.map = L.map('map').setView([this.matrizData.ubicacion.y, this.matrizData.ubicacion.x], 13);

    // Usar OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Crear el marcador inicial en el mapa
    this.marker = L.marker([this.matrizData.ubicacion.y, this.matrizData.ubicacion.x], { draggable: true }).addTo(this.map);

    // Actualizar las coordenadas cuando se mueve el marcador
    this.marker.on('dragend', (event) => {
      const latLng = event.target.getLatLng();
      this.coordenadas = { lat: latLng.lat, lng: latLng.lng };
      this.form.patchValue({
        latitud: latLng.lat,
        longitud: latLng.lng
      });
    });
  }

  // Método para guardar los cambios de la matriz
  guardarMatriz(): void {
    // Verifica si el formulario es válido
    if (this.form.invalid) {
      console.log('Formulario inválido');
      return; // Si el formulario es inválido, no continuamos
    }
  
    // Recoger los datos del formulario
    const updatedMatriz = {
      ...this.matrizData,
      ...this.form.value,
      ubicacion: {
        x: this.form.get('longitud')?.value,  // Obtener las coordenadas del formulario
        y: this.form.get('latitud')?.value
      }
    };
  
    // Verifica si los valores de las coordenadas son correctos
    console.log(updatedMatriz);
  
    // Enviar los datos actualizados a la API usando el servicio
    this.matrizService.guardarMatriz(updatedMatriz).subscribe({
      next: () => this.dialogRef.close(updatedMatriz),  // Cerrar el diálogo al guardar
      error: (err: HttpErrorResponse) => {
        console.error('Error al guardar matriz:', err.message);  // Mostrar el error específico
      }
    });
  }
  
  

  cerrar(): void {
    this.dialogRef.close();
  }
}