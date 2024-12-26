
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ProfileDropdownComponent } from '../profile-dropdown/profile-dropdown.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink,RouterOutlet ,ProfileDropdownComponent,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
})
export class DashboardComponent implements OnInit {
  isAdmin: boolean = false;
 
  currentUser$ !: Observable<User | null>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.currentUser$ = this.authService.getCurrentUser (); // Get the current user observable
    this.currentUser$.subscribe(user => {
      console.log('Current User:', user); // Log the entire user object
      this.isAdmin = user?.roles?.toUpperCase() === 'ADMIN'; // Check if the user is an Admin
      console.log('Is Admin:', this.isAdmin);
    });
  }
  toggleSidebar(): void {
    // Implement sidebar toggle logic
    console.log('Toggle Sidebar');
  }

  handleLogout(): void {
    this.authService.logout();
    this.toastr.success('Logout successful', 'Success');
    this.router.navigate(['/login']);
  }
  redirectToadmindetails() {
    this.router.navigate(['dashboard/admindetails']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }

}
