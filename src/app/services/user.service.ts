import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model'; // Your User model
import { ApiService } from 'app/api.service'; // Assuming ApiService is in app/api.service

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {}

  // Set the current user to the BehaviorSubject
  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  // Get the current user value directly
  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  // Fetch user info from the API and update currentUserSubject
  fetchUser(): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json',
    });

    return this.apiService.get<User>('users/self', { headers, observe: 'response' }).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          const user = event.body;
          if (user) {
            this.setCurrentUser(user); // Update the current user in the BehaviorSubject
            return user;
          }
        }
        throw new Error('Failed to fetch user data');
      }),
      catchError((error) => {
        console.error('Error fetching user:', error);
        throw error;
      })
    );
  }
}
