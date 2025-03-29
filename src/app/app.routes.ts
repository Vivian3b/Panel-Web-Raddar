import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { InicioComponent } from './estructura/inicio/inicio.component';
import { authGuard } from './guards/auth.guard';
import { SidebarComponent } from './estructura/sidebar/sidebar.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { PromocionComponent } from './pages/promocion/promocion.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { MatrizComponent } from './pages/matriz/matriz.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirige al login al iniciar
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { 
    path: 'dashboard', 
    component: SidebarComponent, canActivate: [authGuard],  // Protege el dashboard (y rutas hijas)
    children: [
      //{ path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
      { path: 'inicio', component: InicioComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'promociones', component: PromocionComponent },
      { path: 'empresas', component: EmpresasComponent },
      { path: 'matriz', component: MatrizComponent },
      /*{ path: 'roles', component: RolesComponent },
        { path: 'permisos', component: PermisosComponent },
        { path: 'clientes', component: ClientesComponent },
        { path: 'listacat', component: ListacatComponent },
        { path: 'transacciones', component: TransaccionesComponent },
         */
    ]
  },
  /*
  { path: 'usuarios', redirectTo: '/dashboard/usuarios', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: '/dashboard/inicio', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: '/dashboard/roles', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: '/dashboard/permisos', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: '/dashboard/clientes', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: '/dashboard/empresas', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: '/dashboard/listacat', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: '/dashboard/transacciones', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: '/dashboard/promociones', pathMatch: 'full' },
   */

  //para manejar rutas inexistentes
  //{ path: '**', component: NotFoundComponent }  

      
];