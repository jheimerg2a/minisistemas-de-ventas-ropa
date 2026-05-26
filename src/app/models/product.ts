// Estructura de un producto
export interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  imagen: string;
}

export interface CartItem {
  product: Product;
  cantidad: number;
}

export interface Sale {
  id: string;
  fecha: string;
  items: { nombre: string; cantidad: number; subtotal: number }[];
  totalItems: number;
  total: number;
}

// ← NUEVO
export interface User {
  nombre: string;
  email: string;
  rol: 'admin' | 'cajero';
}
