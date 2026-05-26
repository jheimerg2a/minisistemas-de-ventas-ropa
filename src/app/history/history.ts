import { Component, inject, input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store';
import { Sale } from '../models/product';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class HistoryComponent implements OnChanges {
  store = inject(StoreService);

  // Recibe el trigger desde el padre para refrescar
  refresh = input<number>(0);

  sales: Sale[] = [];

  ngOnChanges(): void {
    this.load();
  }

  load(): void {
    this.sales = this.store.getSales();
  }

  clearAll(): void {
    if (!confirm('¿Borrar todo el historial de ventas?')) return;
    this.store.clearHistory();
    this.sales = [];
  }
}
