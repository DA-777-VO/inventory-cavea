import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem, Location } from '../../models/inventory.model';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './inventory-list.html',
  styleUrls: ['./inventory-list.css']
})
export class InventoryListComponent implements OnInit {
  private inventoryService = inject(InventoryService);


  items = signal<InventoryItem[]>([]);
  locations = signal<Location[]>([]);
  loading = signal(false);

  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);

  selectedLocationId = signal<string>('all');
  sortBy = signal<string>('name');
  sortOrder = signal<'ASC' | 'DESC'>('ASC');


  ngOnInit(): void {
    this.loadLocations();
    this.loadInventory();
  }


  loadLocations(): void {
    this.inventoryService.getLocations().subscribe({
      next: (locations) => {
        this.locations.set(locations);
      },
      error: (error) => {

        console.error('Error loading locations:', error);
      }
    });
  }

  loadInventory(): void {
    this.loading.set(true);

    this.inventoryService.getInventoryItems(
      this.currentPage(),
      this.selectedLocationId(),
      this.sortBy(),
      this.sortOrder()
    ).subscribe({
      next: (response) => {
        this.items.set(response.items);
        this.totalPages.set(response.totalPages);
        this.totalItems.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.loading.set(false);
      }
    });
  }

  onLocationChange(): void {
    this.currentPage.set(1);
    this.loadInventory();
  }


  onSort(field: string): void {
    if (this.sortBy() === field) {

      this.sortOrder.set(this.sortOrder() === 'ASC' ? 'DESC' : 'ASC');
    } else {

      this.sortBy.set(field);
      this.sortOrder.set('ASC');
    }
    this.currentPage.set(1);
    this.loadInventory();
  }


  deleteItem(id: string | undefined): void {

    if (!id) {
      console.error('Cannot delete item: ID is undefined');
      return;
    }

    if (confirm('Are you sure you want to delete the item?')) {
      this.inventoryService.deleteInventoryItem(id).subscribe({
        next: () => {

          if (this.items().length === 1 && this.currentPage() > 1) {
            this.currentPage.update(page => page - 1);
          }
          this.loadInventory();
        },
        error: (error) => {
          console.error('Error deleting item:', error);
        }
      });
    }
  }


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadInventory();
    }
  }


  get pageNumbers(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];


    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (current <= 3) {
      end = Math.min(5, total);
    }

    if (current >= total - 2) {
      start = Math.max(1, total - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }


  getSortIcon(field: string): string {
    if (this.sortBy() !== field) return '';
    return this.sortOrder() === 'ASC' ? '↑' : '↓';
  }
}
