import { Component, inject, OnInit } from '@angular/core';
import { Empresa } from '../../interfaces/Empresa';
import { EmpresaService } from '../../services/empresa.service';
import { MatDialog } from '@angular/material/dialog';
import { EmpresaDialogComponent } from './dialog/empresa-dialog/empresa-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedModule } from '../../shared/shared/shared.module';

@Component({
  selector: 'app-empresa',
  imports: [SharedModule],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent implements OnInit {
  displayedColumns: string[] = ['idempresa', 'usuario_idusuario', 'matriz_idmatriz', 'nombre', 'descripcion', 'ubicacion', 'acciones'];
  dataSource: Empresa[] = [];

  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerEmpresas();
  }

  obtenerEmpresas() {
    this.empresaService.obtenerEmpresas().subscribe({
      next: (data: Empresa[]) => {
        this.dataSource = data.map(empresa => ({
          ...empresa,
          usuario_idusuario: empresa.usuario_idusuario || 1,
          matriz_idmatriz: empresa.matriz_idmatriz || 1,
          eliminado: empresa.eliminado || 0
        }));
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener empresas:', error);
      }
    });
  }

  eliminarEmpresa(idempresa: number) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta empresa?');
    if (!confirmacion) return;

    this.empresaService.eliminarEmpresa(idempresa).subscribe({
      next: () => this.obtenerEmpresas(),
      error: (error) => console.error('Error al eliminar empresa:', error)
    });
  }

  abrirDialogo(empresa?: Empresa) {
    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '400px',
      data: empresa || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idempresa) {
          this.empresaService.actualizarEmpresa(result).subscribe({
            next: () => this.obtenerEmpresas(),
            error: (error) => console.error('Error al actualizar empresa:', error)
          });
        } else {
          this.empresaService.crearEmpresa(result).subscribe({
            next: () => this.obtenerEmpresas(),
            error: (error) => console.error('Error al crear empresa:', error)
          });
        }
      }
    });
  }

  getUbicacion(ubicacion: any): string {
    if (ubicacion && ubicacion.lat && ubicacion.lng) {
      return `Lat: ${ubicacion.lat}, Lng: ${ubicacion.lng}`;
    }
    return 'Ubicación no disponible';
  }
}