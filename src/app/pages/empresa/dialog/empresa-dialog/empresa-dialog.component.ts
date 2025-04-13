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
  matrices: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmpresaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private empresaService: EmpresaService
  ) {
    this.form = this.fb.group({
      idempresa: [data?.idempresa || null],
      usuario_idusuario: [data?.usuario_idusuario || null],
      matriz_idmatriz: [data?.matriz_idmatriz || null],
      nombre: [data?.nombre || ''],
      descripcion: [data?.descripcion || ''],
      ubicacion: [data?.ubicacion ? `${data.ubicacion.x}, ${data.ubicacion.y}` : '']
    });
  }

  ngOnInit(): void {
    // Cargar las matrices disponibles cuando el componente se inicializa
    this.empresaService.obtenerMatrices().subscribe((matrices) => {
      this.matrices = matrices;
    });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
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

    formValue.ubicacion = {
      x: latLng.lng,
      y: latLng.lat
    };
    formValue.usuario_idusuario = formValue.usuario_idusuario || 1; 

    console.log('Form empresa guardado:', formValue);
    this.dialogRef.close(formValue);
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }
}