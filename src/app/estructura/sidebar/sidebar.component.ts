import { Component, inject } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccesoService } from '../../services/acceso.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private router = inject(Router);
  private accesoService = inject(AccesoService);
  isHandset$: Observable<boolean>;

  principalItem = {
    name: 'Principal',
    icon: 'home',
    route: '/dashboard/inicio'
  };
  menuItems = [
    
    {
      name: 'Usuarios',
      icon: 'people',
      items: [
        { name: 'Usuarios', route: '/dashboard/usuario' },
        { name: 'Roles', route: '/dashboard/rol' },
      ],
    },
    {
      name: 'Clientes',
      icon: 'business',
      items: [
        { name: 'Clientes', route: '/dashboard/cliente' },
        { name: 'Matrices', route: '/dashboard/matriz' },
        { name: 'Empresas', route: '/dashboard/empresa' },
      ],
    },
    {
      name: 'Transacciones',
      icon: 'attach_money',
      items: [
        { name: 'Movimientos', route: '/dashboard/transaccion' },
        { name: 'Métodos de Pago', route: '/dashboard/metodopago' },
        { name: 'Tarjetas', route: '/dashboard/tarjeta' },
      ],
    },
    {
      name: 'Promociones',
      icon: 'campaign',
      items: [
        { name: 'Promociones', route: '/dashboard/promocion' },
        { name: 'Guardados', route: '/dashboard/guardado' },
        { name: 'Notificaciones', route: '/dashboard/notificacion' },
      ],
    },
  ];

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$ = breakpointObserver.observe([Breakpoints.Handset])
      .pipe(map(result => result.matches));
  }

  logout() {
    this.accesoService.logout();
    console.log('Usuario deslogueado');
  }
}