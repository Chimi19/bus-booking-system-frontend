
import { Observable } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { ApiService } from '../api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private apiService: ApiService) {}

  login(loginData: LoginModel): Observable<any> {
    return this.apiService.post('/login', loginData);
  }
}