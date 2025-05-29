import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-confirmar-dialog',
  imports: [
    MatDialogModule,
    MatDialogModule, MatButtonModule
  ],
  templateUrl: './confirmar-dialog.component.html',
  styleUrl: './confirmar-dialog.component.css'
})
export class ConfirmarDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmarDialogComponent>) {}

  cerrar() {
    this.dialogRef.close();
  }
}
