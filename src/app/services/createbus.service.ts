import { Observable } from "rxjs";
import { ApiService } from "../api.service";
import { SignupModel } from "../models/signup.model";
import { Injectable } from "@angular/core";
import { AddBusModel } from "../models/addbus.model";

@Injectable({
  providedIn: 'root'
})
export class CreateBusService {
  
  constructor(private apiService: ApiService) {}
    signup(busData: AddBusModel): Observable<any> {
      return this.apiService.post('/bus', busData);
    }
  }