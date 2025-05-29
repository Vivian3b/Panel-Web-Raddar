import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verificacion-cuenta',
  imports: [CommonModule],
  templateUrl: './verificacion-cuenta.component.html',
  styleUrl: './verificacion-cuenta.component.css'
})
export class VerificacionCuentaComponent implements OnInit {
  mensaje = 'Verificando cuenta...';

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.usuarioService.verifyEmail(token).subscribe({
        next: () => {
          this.mensaje = 'Tu cuenta ha sido verificada con éxito.';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: () => {
          this.mensaje = 'El enlace no es válido o ha expirado.';
        }
      });
    }
  }
}