import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { InicioComponent } from './estructura/inicio/inicio.component';
import { authGuard } from './guards/auth.guard';
import { SidebarComponent } from './estructura/sidebar/sidebar.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { PromocionComponent } from './pages/promocion/promocion.component';
import { MatrizComponent } from './pages/matriz/matriz.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { EmpresaComponent } from './pages/empresa/empresa.component';
import { RolComponent } from './pages/rol/rol.component';
import { MovimientoComponent } from './pages/movimiento/movimiento.component';
import { MetodopagoComponent } from './pages/metodopago/metodopago.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { PermisoComponent } from './pages/permiso/permiso.component';
import { ModuloComponent } from './pages/modulo/modulo.component';
import { VerificacionCuentaComponent } from './pages/verificacion-cuenta/verificacion-cuenta.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent },
  { path: 'confirmar/:token', component: VerificacionCuentaComponent },

  
  { 
    path: 'dashboard', 
    component: SidebarComponent, canActivate: [authGuard],  // Protege el dashboard (y rutas hijas)
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'usuario', component: UsuariosComponent },
      { path: 'rol', component: RolComponent },
      { path: 'permiso', component: PermisoComponent},
      { path: 'modulo', component: ModuloComponent},
      { path: 'cliente', component: ClienteComponent },
      { path: 'matriz', component: MatrizComponent },
      { path: 'empresa', component: EmpresaComponent },
      { path: 'movimiento', component: MovimientoComponent },
      { path: 'metodopago', component: MetodopagoComponent},
      { path: 'promocion', component: PromocionComponent },
      { path: 'categoria', component: CategoriaComponent},
    ]
  },
];