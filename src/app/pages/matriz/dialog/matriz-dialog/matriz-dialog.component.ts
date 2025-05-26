import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-matriz-dialog',
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatDialogModule,],
  templateUrl: './matriz-dialog.component.html',
  styleUrl: './matriz-dialog.component.css'
})
export class MatrizDialogComponent implements AfterViewInit{
  form: FormGroup;
  map!: L.Map;
  marker!: L.Marker;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MatrizDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      idmatriz: [data.idmatriz || null],
      nombre: [data.nombre || ''],
      ubicacion: [data.ubicacion ? `${data.ubicacion.x}, ${data.ubicacion.y}` : ''],
      telefono: [data.telefono || ''],
      email: [data.email || '']
    });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    const lat = this.data?.ubicacion?.y || 19.4326;  
    const lng = this.data?.ubicacion?.x || -99.1332;  
  
    console.log('Coordenadas iniciales:', lat, lng);  // Verifica las coordenadas
  
    // Crear el mapa con las coordenadas iniciales
    this.map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  
    // Colocar el marcador en las coordenadas iniciales
    this.marker = L.marker([lat, lng]).addTo(this.map);
  
    // evento de click para actualizar el marcador
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker.setLatLng(e.latlng);
      this.form.get('ubicacion')?.setValue(`${e.latlng.lat}, ${e.latlng.lng}`);
    });
  }

  guardar() {
    const formValue = this.form.value;
  
    const latLng = this.marker.getLatLng();  // Obtiene la latitud y longitud del marcador
    formValue.ubicacion = {
      x: latLng.lng,  
      y: latLng.lat   
    };
  
    console.log('Form data guardado:', formValue);  // Verifica lo que se guarda
  
    this.dialogRef.close(formValue);
  }
  
  cerrarDialogo() {
    this.dialogRef.close();
  }
}