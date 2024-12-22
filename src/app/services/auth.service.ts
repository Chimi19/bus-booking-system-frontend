import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginModel,  } from '../models/login.model';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { LoginResponseModel } from '../models/signup.model';
import { Bus } from 'app/models/bus.model';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'accessToken';
  private REFRESH_TOKEN_KEY = 'refreshToken';

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private router: Router
  ) {}

  // Store tokens
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('Token stored:', token);

  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  // Get tokens
  getToken(): string | null {
const token = localStorage.getItem(this.TOKEN_KEY);
console.log('Retrieved Token in AuthService:', token);
return token;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Remove tokens
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // Validate token by calling a protected endpoint
  validateToken(): Observable<boolean> {  
    return this.apiService.get('users/self').pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  // Login method
  login(loginData: LoginModel): Observable<LoginResponseModel> {
    return this.apiService.post<LoginResponseModel>('auth/login', loginData).pipe(
      map((response: any) => {
        console.log('Login Response:', response); // Log the entire response
        // Assuming the backend returns an object with access_token and refresh_token
        this.setToken(response.data.accessToken);
        this.setRefreshToken(response.data.refreshToken);
        return response.data;
      })
    );
  }

  
  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>('users/self').pipe(
      map((response: any) => {
        // Create a new User object from the API response
        const user: User = {
          id: response?.data?.user.id,
          // Map other properties from the response
          email: response?.data?.user.email,
          name:"Admin"
          // Add any additional mapping as needed
        };
        
        this.userService.setCurrentUser(user);
        return user;
      }),
      catchError((error) => {
        if(error.status===403){
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // Logout method
  logout(): void {
    this.removeToken();
    this.removeRefreshToken();
  }

  // Refresh token method
  refreshToken(): Observable<LoginResponseModel> {
    const refreshToken = this.getRefreshToken();
    
    return this.apiService.post<LoginResponseModel>('auth/refresh-token', null, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    }).pipe(
      map((response: any) => {
        this.setToken(response?.data?.accessToken);
        this.setRefreshToken(response?.data?.refreshToken);
        return response.data;
      })
    );
  }
}
