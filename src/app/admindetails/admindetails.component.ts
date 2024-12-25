import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';  // Import the Router to handle navigation
import { ApiService } from 'app/api.service';
import { EditadminComponent } from 'app/editadmin/editadmin.component';
import { ToastrService } from 'ngx-toastr';  // Import the ToastrService

interface User {
  id: string;
  name: string;
  address: string;
  email: string;
  role: string;
}

interface RestResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
  };
}

@Component({
  selector: 'app-admindetails',
  templateUrl: './admindetails.component.html',
  imports: [EditadminComponent],
  styleUrls: ['./admindetails.component.css']
})
export class AdmindetailsComponent implements OnInit{
  userInfo: User | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private toastr: ToastrService,  // Inject ToastrService
    private apiService: ApiService
  ) {}

  logout(): void {
    // Clear user data from localStorage (assuming token is stored here)
    localStorage.removeItem('accessToken');

    // Optionally, clear other user data if needed
    // localStorage.removeItem('userData');

    // Show success message
    this.toastr.success('You have logged out successfully.', 'Success');

    // Redirect the user to the login page
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.fetchUserInfo();
  }

  
  private fetchUserInfo(): void {
    this.loading = true;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    };

    this.apiService.get<RestResponse>('users/self', { headers, observe: 'response' }).subscribe({
      next: (event) => {

        if (event.type === HttpEventType.Response) {
          // Cast the event to HttpResponse
          const response = event as HttpResponse<RestResponse>;

          if (response.body) {
            this.userInfo = response.body.data?.user;
          } else {
            this.error = 'No data received from server';
            this.toastr.error('No data received from server');
          }
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.error = error.message;
        this.loading = false;
        this.toastr.error('Failed to fetch user information');
      }
    });
  }

  openEdit(profile: User): void {
    if (!profile) {
      this.toastr.warning('No user profile found to edit.');
      return;
    }

    // Log the profile to check if it's passed correctly
    console.log('Editing user profile:', profile);

    // Navigate to the edit page with query parameters
    this.router.navigate(['/dashboard/editAdmin'], {
      queryParams: { id: profile.id },
    });
  }
}
