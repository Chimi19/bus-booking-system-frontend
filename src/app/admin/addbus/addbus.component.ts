import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SignupService } from '../../services/signup.service';
import { SignupModel } from '../../models/signup.model';
import { AddBusModel } from '../../models/addbus.model';
import { CreateBusService } from '../../services/createbus.service';

@Component({
  selector: 'app-addbus',
  imports: [ RouterModule,ReactiveFormsModule, CommonModule, ToastrModule],
  templateUrl: './addbus.component.html',
  styleUrl: './addbus.component.css',
})
export class AddbusComponent {


  busForm: FormGroup;
    submitted = false;
    errorMessage = '';
  
    constructor(
      private formBuilder: FormBuilder,
      private createbusservice: CreateBusService,
      private router: Router,
      private toastr: ToastrService
    ) {
      this.busForm = this.formBuilder.group({
        bus_no: ['', [
          Validators.required, 
        ]],
        departure: ['', [
          Validators.required,
        ]],
        seats_availibility: ['', Validators.required],
        via: ['', Validators.required]
      },
      )}
  
  
  
    onSubmit(): void {
      this.submitted = true;
  
      if (this.busForm.invalid) {
        return;
      }
  
      const createBus: AddBusModel = {
        bus_no: this.busForm.value.bus_no,
        departure: this.busForm.value.departure,
        seats_availability: this.busForm.value.seats_availability,
        via: this.busForm.value.via
      };
  
      this.createbusservice.signup(createBus).subscribe({
        next: (data) => {
         this.toastr.success('Signup successful', 'Success');
         this.router.navigate(['/login']);
        },
        error: (data) => {
          this.toastr.error(data.error?.message || 'Signup failed', 'Error')
        }
      });
    }
  
    // Getter for easy access to form fields
    get f() { return this.busForm.controls; }
}
