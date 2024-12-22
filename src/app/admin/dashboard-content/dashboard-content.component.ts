import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
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
  loading: boolean = true; 

  constructor(private busService: BusService, private toastr: ToastrService,     private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchBuses(); 
  }

  fetchBuses(): void {
    this.busService.getBus().subscribe(
      (data: Bus[]) => {
        this.buses = data; 
        this.loading = false; 
      },
      (error) => {
        console.error('Error fetching buses:', error);
        this.loading = false;
      }
    );
  }
  onDelete(busId: number): void { 
    const confirmDelete = confirm('Are you sure you want to delete this bus?');
    if (confirmDelete) {
        this.loading = true;
        this.busService.deleteBusbyId(busId.toString()).subscribe( 
            () => {
                this.toastr.success('Bus deleted successfully!', 'Success');
                this.buses = this.buses.filter(bus => bus.id !== busId);
                this.loading = false; // Set loading to false
                this.router.navigateByUrl('/dashboard')


              },
            (error) => {
               
            }
        );
    }
}
  
}
