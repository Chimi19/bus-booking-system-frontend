import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'app/environment';
import { Bus } from 'app/models/bus.model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private busSubject = new BehaviorSubject<Bus | null>(null);
  bus$ = this.busSubject.asObservable();

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  addBus(bus: Bus): Observable<Bus> {
    return this.http.post<Bus>(`${this.baseUrl}bus`, bus);
  }

  getBus(): Observable<Bus[]> {
    return this.http.get<{ status: boolean; data: { bus: Bus[] } }>(`${this.baseUrl}bus`).pipe(
      tap(response => console.log('API Response:', response)), // Log the full response
      map(response => response.data.bus) // Access the bus array correctly
    );
  }
  
  getBusbyId(busId: string): Observable<Bus> {
    return this.http.get<Bus>(`${this.baseUrl}bus/${busId}`); 
  }
  updateBus(busId: string, busData: Bus):Observable<Bus>{
    return this.http.patch<Bus>(`${this.baseUrl}bus/put/${busId}`, busData);
  }
  deleteBusbyId(busId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}bus/${busId}`); 
}
}
