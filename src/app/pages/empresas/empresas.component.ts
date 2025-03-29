import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../interfaces/Empresa';
import { CommonModule } from '@angular/common';
import { EmpresasDialogComponent } from './dialogs/empresas-dialog/empresas-dialog.component';

@Component({
  selector: 'app-empresas',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css'
})
export class EmpresasComponent implements OnInit{

  displayedColumns: string[] = ['nombre', 'descripcion', 'ubicacion', 'acciones'];
  dataSource: Empresa[] = [];

  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerEmpresas();

}  

  obtenerEmpresas() {
    this.empresaService.getEmpresas().subscribe({
      next: (data) => {
        this.dataSource = data.map(empresa => ({
          ...empresa,
          usuario_idusuario: empresa.usuario_idusuario || 1,
          matriz_idmatriz: empresa.matriz_idmatriz || 1,
          eliminado: empresa.eliminado || 0
        }));
      },
      error: (error) => {
        console.error('Error al obtener empresas:', error);
      }
    });
  }

  eliminarEmpresa(idempresa: number) {
    // Aquí llamas al servicio para eliminar la empresa
    this.empresaService.eliminarEmpresa(idempresa).subscribe({
      next: () => {
        // Filtra la empresa eliminada de la lista
        this.dataSource = this.dataSource.filter(empresa => empresa.idempresa !== idempresa);
      },
      error: (error) => {
        console.error('Error al eliminar empresa:', error);
      }
    });
  }

  abrirDialogo(empresa?: Empresa) {
    const dialogRef = this.dialog.open(EmpresasDialogComponent, {
      data: empresa || {}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Verifica si la empresa fue actualizada o agregada
        const index = this.dataSource.findIndex(emp => emp.idempresa === result.idempresa);
        if (index !== -1) {
          // Si ya existe, actualiza la empresa en la tabla
          this.dataSource[index] = result;
        } else {
          // Si es una nueva empresa, la agrega a la lista
          this.dataSource.push(result);
        }
        // Actualiza la vista con los nuevos datos
        this.dataSource = [...this.dataSource];
      }
    });
  }
}  