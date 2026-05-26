// Estructura de un producto
export interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  imagen: string;
}

// Un item dentro del carrito
export interface CartItem {
  product: Product;
  cantidad: number;
}

// Una venta guardada en historial
export interface Sale {
  id: string;
  fecha: string;
  items: { nombre: string; cantidad: number; subtotal: number }[];
  totalItems: number;
  total: number;
}
