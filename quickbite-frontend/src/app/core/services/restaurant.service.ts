import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Restaurant, RestaurantRequest } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private readonly API = `${environment.apiUrl}/api/restaurants`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Restaurant[]> { return this.http.get<Restaurant[]>(`${this.API}/all`); }
  getById(id: number): Observable<Restaurant> { return this.http.get<Restaurant>(`${this.API}/${id}`); }
  getByCity(city: string): Observable<Restaurant[]> { return this.http.get<Restaurant[]>(`${this.API}/city/${city}`); }
  getByCuisine(c: string): Observable<Restaurant[]> { return this.http.get<Restaurant[]>(`${this.API}/cuisine/${c}`); }
  search(name: string): Observable<Restaurant[]> { return this.http.get<Restaurant[]>(`${this.API}/search?name=${name}`); }
  getMyRestaurants(): Observable<Restaurant[]> { return this.http.get<Restaurant[]>(`${this.API}/my`); }
  getPending(): Observable<Restaurant[]> { return this.http.get<Restaurant[]>(`${this.API}/pending`); }
  register(data: RestaurantRequest): Observable<Restaurant> { return this.http.post<Restaurant>(this.API, data); }
  update(id: number, data: RestaurantRequest): Observable<Restaurant> { return this.http.put<Restaurant>(`${this.API}/${id}`, data); }
  approve(id: number): Observable<Restaurant> { return this.http.put<Restaurant>(`${this.API}/approve/${id}`, {}); }
  toggleOpen(id: number): Observable<Restaurant>  { return this.http.put<Restaurant>(`${this.API}/toggle/${id}`, {}); }
  delete(id: number): Observable<string> { return this.http.delete<string>(`${this.API}/${id}`); }
}