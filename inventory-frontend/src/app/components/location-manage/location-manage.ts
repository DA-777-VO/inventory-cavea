import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Location } from '../../models/inventory.model';

@Component({
  selector: 'app-location-manage',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './location-manage.html',
  styleUrls: ['./location-manage.css']
})
export class LocationManageComponent implements OnInit {
  private inventoryService = inject(InventoryService);

  locations = signal<Location[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  newLocationName = signal('');
  isAdding = signal(false);

  editingLocationId = signal<string | null>(null);
  editingLocationName = signal('');

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.inventoryService.getLocations().subscribe({
      next: (locations) => {
        this.locations.set(locations);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        this.errorMessage.set('ლოკაციების ჩატვირთვისას დაფიქსირდა შეცდომა');
        this.loading.set(false);
      }
    });
  }

  startAdd(): void {
    this.newLocationName.set('');
    this.isAdding.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  cancelAdd(): void {
    this.isAdding.set(false);
    this.newLocationName.set('');
  }

  addLocation(): void {
    const name = this.newLocationName().trim();

    if (!name) {
      this.errorMessage.set('სახელი სავალდებულოა');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.inventoryService.createLocation(name).subscribe({
      next: (newLocation) => {
        this.locations.update(locs => [...locs, newLocation]);
        this.successMessage.set(`ლოკაცია "${name}" წარმატებით დაემატა`);
        this.isAdding.set(false);
        this.newLocationName.set('');
        this.loading.set(false);

        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        console.error('Error creating location:', error);
        if (error.status === 400 && error.error.error.includes('already exists')) {
          this.errorMessage.set('ასეთი სახელის ლოკაცია უკვე არსებობს');
        } else {
          this.errorMessage.set('ლოკაციის დამატებისას დაფიქსირდა შეცდომა');
        }
        this.loading.set(false);
      }
    });
  }

  startEdit(location: Location): void {
    this.editingLocationId.set(location.id);
    this.editingLocationName.set(location.name);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  cancelEdit(): void {
    this.editingLocationId.set(null);
    this.editingLocationName.set('');
  }

  saveEdit(id: string): void {
    const name = this.editingLocationName().trim();

    if (!name) {
      this.errorMessage.set('სახელი სავალდებულოა');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.inventoryService.updateLocation(id, name).subscribe({
      next: (updatedLocation) => {
        this.locations.update(locs =>
          locs.map(loc => loc.id === id ? updatedLocation : loc)
        );
        this.successMessage.set(`ლოკაცია წარმატებით განახლდა`);
        this.editingLocationId.set(null);
        this.editingLocationName.set('');
        this.loading.set(false);

        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        console.error('Error updating location:', error);
        if (error.status === 400 && error.error.error.includes('already exists')) {
          this.errorMessage.set('ასეთი სახელის ლოკაცია უკვე არსებობს');
        } else {
          this.errorMessage.set('ლოკაციის განახლებისას დაფიქსირდა შეცდომა');
        }
        this.loading.set(false);
      }
    });
  }

  deleteLocation(location: Location): void {
    const confirmMessage = `ნამდვილად გსურთ ლოკაციის "${location.name}" წაშლა?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.inventoryService.deleteLocation(location.id).subscribe({
      next: () => {
        this.locations.update(locs => locs.filter(loc => loc.id !== location.id));
        this.successMessage.set(`ლოკაცია "${location.name}" წარმატებით წაიშალა`);
        this.loading.set(false);

        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        console.error('Error deleting location:', error);
        if (error.status === 400 && error.error.error.includes('existing inventory')) {
          this.errorMessage.set('ლოკაციის წაშლა შეუძლებელია - მასზე მიბმული ნივთები არსებობს');
        } else {
          this.errorMessage.set('ლოკაციის წაშლისას დაფიქსირდა შეცდომა');
        }
        this.loading.set(false);
      }
    });
  }
}
