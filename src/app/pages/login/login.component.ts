import { Component, inject } from '@angular/core';
import { AccesoService } from '../../services/acceso.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../interfaces/Login';

import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private accesoService = inject(AccesoService)
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group({
    correo:['',Validators.required],
    contraseña:['',Validators.required]
  })
  
  iniciarSesion(){
    
    if(this.formLogin.invalid) return;

    const objeto: Login = {
      email: this.formLogin.value.correo,
      contraseña: this.formLogin.value.contraseña
    }

    this.accesoService.login(objeto).subscribe({
      next:(data)=>{
        if (data.accessToken && data.refreshToken) {
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          
          this.router.navigate(['/dashboard/inicio']);
          
        } else {
          alert("Credenciales incorrectas");
          
        }        
      },
      error: (error) => {
        console.log("Error de autenticación:", error.message); 
        if (error.status === 401) {
          alert("Usuario o contraseña incorrectos");
        } else {
          alert("Error de servidor, intenta más tarde.");
        }
      }

    })
  }

  registrarse(){
    this.router.navigate(['registro'])
  }
}
