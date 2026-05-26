import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store';
import { Product } from '../models/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent {
  store = inject(StoreService);

  // Evento que avisa al padre cuando se agrega un producto
  added = output<string>();

  onAdd(product: Product): void {
    if (product.stock === 0) return;
    this.store.addToCart(product);
    this.added.emit(product.nombre);
  }
}
