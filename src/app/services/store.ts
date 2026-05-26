import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem, Sale } from '../models/product';

@Injectable({ providedIn: 'root' })
export class StoreService {

  // ── Productos iniciales ──────────────────────
  private readonly PRODUCTOS_INICIALES: Product[] = [
    { id: 1, nombre: 'Camiseta Básica Blanca', precio: 45.00, stock: 12,
      imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
    { id: 2, nombre: 'Jeans Slim Fit', precio: 129.90, stock: 8,
      imagen: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80' },
    { id: 3, nombre: 'Vestido Floral Verano', precio: 89.50, stock: 5,
      imagen: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80' },
    { id: 4, nombre: 'Chaqueta Denim', precio: 159.00, stock: 6,
      imagen: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&q=80' },
    { id: 5, nombre: 'Polo Oversize Negro', precio: 55.00, stock: 15,
      imagen: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80' },
    { id: 6, nombre: 'Falda Midi Beige', precio: 75.00, stock: 4,
      imagen: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80' },
    { id: 7, nombre: 'Blazer Formal Gris', precio: 210.00, stock: 3,
      imagen: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f7b?w=400&q=80' },
    { id: 8, nombre: 'Shorts Deportivo', precio: 39.90, stock: 20,
      imagen: 'https://images.unsplash.com/photo-1562183241-840b8af0721e?w=400&q=80' },
  ];

  // ── Signals (estado reactivo de Angular) ─────
  products  = signal<Product[]>([]);
  cartItems = signal<CartItem[]>([]);

  // ── Valores calculados automáticamente ───────
  cartTotal = computed(() =>
    this.cartItems().reduce((acc, i) => acc + i.product.precio * i.cantidad, 0)
  );
  cartCount = computed(() =>
    this.cartItems().reduce((acc, i) => acc + i.cantidad, 0)
  );

  constructor() {
    this.loadProducts();
  }

  // ── Cargar productos desde LocalStorage ──────
  private loadProducts(): void {
    const saved = localStorage.getItem('productos');
    if (saved) {
      this.products.set(JSON.parse(saved));
    } else {
      this.products.set(this.PRODUCTOS_INICIALES.map(p => ({ ...p })));
      this.saveProducts();
    }
  }

  private saveProducts(): void {
    localStorage.setItem('productos', JSON.stringify(this.products()));
  }

  // ── Carrito ───────────────────────────────────
  addToCart(product: Product): void {
    if (product.stock === 0) return;

    const current = this.cartItems();
    const existing = current.find(i => i.product.id === product.id);

    if (existing) {
      if (existing.cantidad >= product.stock) return;
      this.cartItems.set(
        current.map(i =>
          i.product.id === product.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      );
    } else {
      this.cartItems.set([...current, { product, cantidad: 1 }]);
    }
  }

  increase(id: number): void {
    const product = this.products().find(p => p.id === id)!;
    const item    = this.cartItems().find(i => i.product.id === id);
    if (!item || item.cantidad >= product.stock) return;

    this.cartItems.set(
      this.cartItems().map(i =>
        i.product.id === id ? { ...i, cantidad: i.cantidad + 1 } : i
      )
    );
  }

  decrease(id: number): void {
    const item = this.cartItems().find(i => i.product.id === id);
    if (!item) return;

    if (item.cantidad === 1) {
      this.removeFromCart(id);
      return;
    }
    this.cartItems.set(
      this.cartItems().map(i =>
        i.product.id === id ? { ...i, cantidad: i.cantidad - 1 } : i
      )
    );
  }

  removeFromCart(id: number): void {
    this.cartItems.set(this.cartItems().filter(i => i.product.id !== id));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  // ── Finalizar venta ───────────────────────────
  checkout(): Sale | null {
    if (this.cartItems().length === 0) return null;

    // Descontar stock
    const updatedProducts = this.products().map(p => {
      const item = this.cartItems().find(i => i.product.id === p.id);
      return item ? { ...p, stock: p.stock - item.cantidad } : p;
    });
    this.products.set(updatedProducts);
    this.saveProducts();

    // Construir venta
    const sale: Sale = {
      id:    `VTA-${Date.now()}`,
      fecha: new Date().toLocaleString('es-PE', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      items: this.cartItems().map(i => ({
        nombre:   i.product.nombre,
        cantidad: i.cantidad,
        subtotal: i.product.precio * i.cantidad
      })),
      totalItems: this.cartCount(),
      total:      this.cartTotal()
    };

    // Guardar en historial
    const sales = this.getSales();
    sales.unshift(sale);
    localStorage.setItem('ventas', JSON.stringify(sales));

    this.clearCart();
    return sale;
  }

  // ── Historial ─────────────────────────────────
  getSales(): Sale[] {
    const raw = localStorage.getItem('ventas');
    return raw ? JSON.parse(raw) : [];
  }

  clearHistory(): void {
    localStorage.removeItem('ventas');
  }
}
