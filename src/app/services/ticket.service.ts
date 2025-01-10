import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'app/environment';
import { Ticket } from 'app/models/ticket.model';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private busSubject = new BehaviorSubject<Ticket | null>(null);
  bus$ = this.busSubject.asObservable();

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.baseUrl}ticket`, ticket);
  }
getTicket(): Observable<Ticket[]> {
  return this.http.get<ArrayBuffer>(`${this.baseUrl}ticket`).pipe(
    tap(response => console.log('API Response:', response)), // Log the full response
    map(buffer => {
      // Convert ArrayBuffer to JSON string
      const jsonString = new TextDecoder().decode(buffer);
      const jsonResponse = JSON.parse(jsonString);
      return jsonResponse.data.ticket; // Access the ticket array correctly
    })
  );
}
  
  getTicketbyId(ticketId: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}Ticket/${ticketId}`); 
}


getUserTickets(): Observable<Ticket[]> {
  return this.http.get<Ticket[]>(`${this.baseUrl}ticket/user`).pipe(
    tap(response => console.log('User  Tickets Response:', response)), // Log the full response
  );
}
deleteUserTicket(id:string): Observable<Ticket[]>{
  return this.http.delete<Ticket[]>(`${this.baseUrl}ticket/user`).pipe(
    tap(response => console.log('User  Tickets Response:', response)), // Log the full response
  );
}

}
