import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { Statistics } from '../../models/inventory.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './statistics.html',
  styleUrls: ['./statistics.css']
})
export class StatisticsComponent implements OnInit {
  private inventoryService = inject(InventoryService);

  statistics = signal<Statistics[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.inventoryService.getStatistics().subscribe({
      next: (data) => {
        this.statistics.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.errorMessage.set('სტატისტიკის ჩატვირთვისას დაფიქსირდა შეცდომა');
        this.loading.set(false);
      }
    });
  }

  get totalProducts(): number {
    return this.statistics().reduce((sum, stat) => sum + Number(stat.totalProducts), 0);
  }

  get totalValue(): number {
    return this.statistics().reduce((sum, stat) => sum + Number(stat.totalPrice), 0);
  }
}
