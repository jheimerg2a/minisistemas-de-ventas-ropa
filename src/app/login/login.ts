import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  auth = inject(AuthService);

  loggedIn = output<void>();

  email    = signal('');
  password = signal('');
  error    = signal('');
  loading  = signal(false);

  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);

    // Pequeño delay para dar sensación de proceso
    setTimeout(() => {
      const ok = this.auth.login(this.email(), this.password());
      if (ok) {
        this.loggedIn.emit();
      } else {
        this.error.set('Correo o contraseña incorrectos');
      }
      this.loading.set(false);
    }, 600);
  }

  fillDemo(rol: 'admin' | 'cajero'): void {
    if (rol === 'admin') {
      this.email.set('admin@tienda.com');
    } else {
      this.email.set('cajero@tienda.com');
    }
    this.password.set('1234');
  }
}
