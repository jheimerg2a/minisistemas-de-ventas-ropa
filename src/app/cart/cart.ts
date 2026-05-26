import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store';
import { Sale } from '../models/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  store = inject(StoreService);

  // Evento que avisa al padre cuando se finaliza la venta
  saleDone = output<Sale>();

  checkout(): void {
    const sale = this.store.checkout();
    if (sale) this.saleDone.emit(sale);
  }
}
