import { Injectable, signal } from '@angular/core';
import type { User } from '../models/product';

// Usuarios hardcodeados (sin backend)
const USUARIOS = [
  { email: 'admin@tienda.com',  password: '1234', nombre: 'Admin',       rol: 'admin'  as const },
  { email: 'cajero@tienda.com', password: '1234', nombre: 'María López', rol: 'cajero' as const },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor() {
    // Recuperar sesión guardada
    const saved = localStorage.getItem('session');
    if (saved) this.currentUser.set(JSON.parse(saved));
  }

  login(email: string, password: string): boolean {
    const found = USUARIOS.find(u => u.email === email && u.password === password);
    if (!found) return false;

    const user: User = { nombre: found.nombre, email: found.email, rol: found.rol };
    this.currentUser.set(user);
    localStorage.setItem('session', JSON.stringify(user));
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('session');
  }
}
