import { Component } from '@angular/core';

import { AccesoService } from '../../services/acceso.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  constructor(private accesoService: AccesoService, private router: Router) {}

  logout(): void {
    this.accesoService.logout();
    this.router.navigateByUrl(""); // Redirige al login
  }
}
