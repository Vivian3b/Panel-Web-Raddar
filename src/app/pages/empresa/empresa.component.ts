import { Component, inject, OnInit } from '@angular/core';
import { Empresa } from '../../interfaces/Empresa';
import { EmpresaService } from '../../services/empresa.service';
import { MatDialog } from '@angular/material/dialog';
import { EmpresaDialogComponent } from './dialog/empresa-dialog/empresa-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { EliminadoComponent } from '../../shared/eliminado/eliminado.component';
import { BusquedaComponent } from '../../shared/busqueda/busqueda.component';

@Component({
  selector: 'app-empresa',
  imports: [SharedModule,
    BusquedaComponent
  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent implements OnInit {
  displayedColumns: string[] = ['idempresa', 'usuario_idusuario', 'matriz_idmatriz', 'nombre', 'descripcion', 'ubicacion', 'acciones'];
  dataSource: Empresa[] = [];

  todasLasEmpresas: Empresa[] = []; 
  filtroTexto: string = '';

  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerEmpresas();
  }

  obtenerEmpresas() {
    this.empresaService.obtenerEmpresas().subscribe({
      next: (data: Empresa[]) => {
        this.todasLasEmpresas = data.map(empresa => ({
          ...empresa,
          usuario_idusuario: empresa.usuario_idusuario || 1,
          matriz_idmatriz: empresa.matriz_idmatriz || 1,
          eliminado: empresa.eliminado || 0
        }));
        this.aplicarFiltro(this.filtroTexto); // 🔧 aplicar filtro actual
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener empresas:', error);
      }
    });
  }

  aplicarFiltro(texto: string) {
    this.filtroTexto = texto;
    const filtro = texto.trim().toLowerCase();
    this.dataSource = this.todasLasEmpresas.filter(empresa =>
      empresa.nombre.toLowerCase().includes(filtro) ||
      empresa.descripcion.toLowerCase().includes(filtro)
    );
  }

  eliminarEmpresa(idempresa: number) {
  const dialogRef = this.dialog.open(EliminadoComponent, {
    width: '350px',
    data: { nombre: 'empresa' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.empresaService.eliminarEmpresa(idempresa).subscribe({
        next: () => this.obtenerEmpresas(),
        error: (error) => console.error('Error al eliminar empresa:', error)
      });
    }
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