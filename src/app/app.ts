import { Component, signal } from '@angular/core';
import { ProductsComponent } from './products/products';
import { CartComponent } from './cart/cart';
import { HistoryComponent } from './history/history';
import type { Sale } from './models/product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductsComponent, CartComponent, HistoryComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  toast       = signal('');
  toastType   = signal('');
  histRefresh = signal(0);
  receipt     = signal<Sale | null>(null);  // ← comprobante actual

  private timer: any;

  onProductAdded(nombre: string): void {
    this.showToast(`"${nombre}" agregado al carrito`, 'info');
  }

  onSaleDone(sale: Sale): void {
    this.receipt.set(sale);                          // ← abre el modal
    this.histRefresh.set(this.histRefresh() + 1);
    this.showToast(`¡Venta registrada! S/ ${sale.total.toFixed(2)}`, 'success');
  }

  closeReceipt(): void {
    this.receipt.set(null);
  }

  printReceipt(): void {
    window.print();
  }

  showToast(msg: string, type: string): void {
    this.toast.set(msg);
    this.toastType.set(type);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.toast.set(''), 3000);
  }
}
