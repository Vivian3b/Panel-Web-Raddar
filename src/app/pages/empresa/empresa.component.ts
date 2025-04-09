import { Component, inject, OnInit } from '@angular/core';
import { Empresa } from '../../interfaces/Empresa';
import { EmpresaService } from '../../services/empresa.service';
import { MatDialog } from '@angular/material/dialog';
import { EmpresaDialogComponent } from './dialog/empresa-dialog/empresa-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-empresa',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
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
        console.error('Error en la solicitud:', error.message);
      }
    });
  }

  eliminarEmpresa(idempresa: number) {
    this.empresaService.eliminarEmpresa(idempresa).subscribe({
      next: () => {
        this.dataSource = this.dataSource.filter(empresa => empresa.idempresa !== idempresa);
      },
      error: (error) => {
        console.error('Error al eliminar empresa:', error);
      }
    });
  }

  abrirDialogo(empresa?: Empresa) {
    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      data: empresa || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.findIndex(emp => emp.idempresa === result.idempresa);
        if (index !== -1) {
          this.dataSource[index] = result;
        } else {
          this.dataSource.push(result);
        }
        this.dataSource = [...this.dataSource];
      }
    });
  }
}