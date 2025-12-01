import { Routes } from '@angular/router';
import { InventoryListComponent } from './components/inventory-list/inventory-list';
import { InventoryAddComponent } from './components/inventory-add/inventory-add';
import { StatisticsComponent } from './components/statistics/statistics';

export const routes: Routes = [
  { path: '', component: InventoryListComponent },
  { path: 'add', component: InventoryAddComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '**', redirectTo: '' }
];
