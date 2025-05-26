import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-eliminado',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './eliminado.component.html',
  styleUrl: './eliminado.component.css'
})
export class EliminadoComponent {
  constructor(
    private dialogRef: MatDialogRef<EliminadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nombre: string }
  ) {}

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}