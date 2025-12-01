import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  InventoryResponse,
  InventoryItem,
  CreateInventoryItem,
  Location,
  Statistics
} from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getInventoryItems(
    page: number = 1,
    locationId: string = 'all',
    sortBy: string = 'name',
    sortOrder: string = 'ASC'
  ): Observable<InventoryResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (locationId !== 'all') {
      params = params.set('locationId', locationId);
    }

    return this.http.get<InventoryResponse>(`${this.apiUrl}/inventory`, { params });
  }

  createInventoryItem(item: CreateInventoryItem): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.apiUrl}/inventory`, item);
  }

  deleteInventoryItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/inventory/${id}`);
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations`);
  }

  getStatistics(): Observable<Statistics[]> {
    return this.http.get<Statistics[]>(`${this.apiUrl}/statistics`);
  }
}
