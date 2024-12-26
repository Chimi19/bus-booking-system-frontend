import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ConfirmationDialogComponent } from 'app/confirmation-dialog/confirmation-dialog.component';
import { Bus } from 'app/models/bus.model';
import { AuthService } from 'app/services/auth.service';
import { BusService } from 'app/services/bus.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, RouterModule,RouterLink],
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.css'
})
export class DashboardContentComponent implements OnInit {

  buses: Bus[] = []; 
  isAdmin: boolean = false

  constructor(private busService: BusService, private authService: AuthService, private toastr: ToastrService, private dialog: Dialog,
      private elementRef: ElementRef,    private router: Router,
  ) {
   
  }

  ngOnInit(): void {
    this.authService.getCurrentUser ().subscribe(user => {
      console.log('Current User:', user); // Log the entire user object
      this.isAdmin = user?.roles?.toUpperCase() === 'ADMIN'; // Check for Admin role
      console.log('Is Admin:', this.isAdmin);
      this.fetchBuses(); // Fetch buses after setting isAdmin
    });
  }
  
  fetchBuses(): void {
    this.busService.getBus().subscribe(
      (data: Bus[]) => {
        console.log('Fetched buses:', data); // This should now log the bus data correctly
        this.buses = data; 
      },
      (error) => {
        console.error('Error fetching buses:', error);
      }
    );
    
  }
  
  onDelete(busId: number): void { 
 const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete the bus?'
      }
    });
    dialogRef.closed.subscribe(result => {
      if (result) {
        this.busService.deleteBusbyId(busId.toString()).subscribe({
          next: (response) => {
            this.toastr.success('Bus deleted successfully!', 'Success');
            this.fetchBuses();
          },
          error: (data) => {
            this.toastr.error(data.error?.message || 'Delete failed', 'Error');
          }
        });
      }
    });


}
  
}
