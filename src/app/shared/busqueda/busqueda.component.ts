import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../shared.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-busqueda',
  imports: [SharedModule, FormsModule],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent {
  filtroTexto: string = '';

  @Output() textoCambio = new EventEmitter<string>();

  onTextoChange() {
    this.textoCambio.emit(this.filtroTexto.trim().toLowerCase());
  }
}
