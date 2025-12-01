import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Location } from '../../models/inventory.model';

@Component({
  selector: 'app-inventory-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './inventory-add.html',
  styleUrls: ['./inventory-add.css']
})
export class InventoryAddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  locations = signal<Location[]>([]);
  submitted = signal(false);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  inventoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    locationId: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.inventoryService.getLocations().subscribe({
      next: (locations) => this.locations.set(locations),
      error: (error) => {
        console.error('Error loading locations:', error);
        this.errorMessage.set('ადგილმდებარეობების ჩატვირთვისას დაფიქსირდა შეცდომა');
      }
    });
  }

  get f() {
    return this.inventoryForm.controls;
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.errorMessage.set(null);

    if (this.inventoryForm.invalid) {
      return;
    }

    this.loading.set(true);

    const formValue = this.inventoryForm.value;
    const inventoryItem = {
      name: formValue.name,
      locationId: formValue.locationId,
      price: parseFloat(formValue.price)
    };

    this.inventoryService.createInventoryItem(inventoryItem).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error creating item:', error);
        this.errorMessage.set('ნივთის დამატებისას დაფიქსირდა შეცდომა');
        this.loading.set(false);
      }
    });
  }
}
