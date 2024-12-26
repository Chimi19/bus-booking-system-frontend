import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ConfirmationDialogComponent } from 'app/confirmation-dialog/confirmation-dialog.component';
import { Bus } from 'app/models/bus.model';
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

  constructor(private busService: BusService, private toastr: ToastrService, private dialog: Dialog,
      private elementRef: ElementRef,    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchBuses();
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
