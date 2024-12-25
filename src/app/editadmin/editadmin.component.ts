import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from 'app/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

interface User {
  id: number;
  name: string;
  address: string;
  email: string;
  roles: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string | null;
  password?: string;
}

@Component({
  selector: 'app-editadmin',
  templateUrl: './editadmin.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./editadmin.component.css'],
})
export class EditadminComponent implements OnInit {
  profileForm: FormGroup;
  userId: number | null = null;
  isLoading = true;
  userData: User | null = null;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: ['', Validators.required],
      createdBy: [{ value: '', disabled: true }],
      updatedBy: [{ value: '', disabled: true }],
      createdAt: [{ value: '', disabled: true }],
      updatedAt: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    console.log('Component initialized');
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log('ID from route:', idParam);
    
    if (idParam) {
      this.userId = +idParam;
      this.fetchUserData();
    } else {
      this.isLoading = false;
      this.error = 'No user ID provided';
      this.toastr.error('No user ID provided');
    }
  }

  fetchUserData(): void {
    console.log('Fetching user data for ID:', this.userId);
    this.isLoading = true;
    this.error = null;

    this.apiService.get(`users/${this.userId}`).pipe(
      tap(response => console.log('API Response:', response)),
      catchError(error => {
        console.error('API Error:', error);
        this.error = error.message || 'Failed to fetch user data';
        this.isLoading = false;
        this.toastr.error(error);
        return of(null);
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Processing response:', response);
        if (response && response.id) {
          this.userData = response;
          this.profileForm.patchValue({
            name: response.name,
            address: response.address,
            email: response.email,
            roles: response.roles,
            createdBy: response.createdBy,
            updatedBy: response.updatedBy,
            createdAt: this.formatDate(response.createdAt),
            updatedAt: response.updatedAt ? this.formatDate(response.updatedAt) : 'Not updated yet'
          });
          console.log('Form updated with user data');
        } else {
          this.error = 'Invalid user data received';
          this.toastr.error(this.error);
        }
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly');
      return;
    }

    const formValues = this.profileForm.getRawValue();
    const updateData: Partial<User> = {
      name: formValues.name,
      address: formValues.address,
      email: formValues.email,
      roles: formValues.roles,
      updatedBy: 1,
      updatedAt: new Date().toISOString()
    };

    if (this.userId) {
      this.apiService.patch(`users/${this.userId}`, updateData).pipe(
        tap(response => console.log('Update Response:', response)),
        catchError(error => {
          console.error('Update Error:', error);
          this.toastr.error('Failed to update profile');
          return of(null);
        })
      ).subscribe({
        next: (response: any) => {
          if (response) {
            this.toastr.success('Profile updated successfully');
            this.router.navigate(['/dashboard/admindetails']);
          }
        }
      });
    }
  }
}