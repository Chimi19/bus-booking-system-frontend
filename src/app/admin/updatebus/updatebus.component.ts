import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Bus } from 'app/models/bus.model';
import { BusService } from 'app/services/bus.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-updatebus',
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './updatebus.component.html',
  styleUrl: './updatebus.component.css'
})
export class UpdatebusComponent implements OnInit{
  busForm: FormGroup;
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  busId: string | null = null;

  models: string[] = ['Minibus', 'Single-decker bus', 'School bus'];
    brands: string[] = ['Volvo', 'Suzuki', 'Toyota'];
    amenitiesOptions: string[] = ['WiFi', 'Air Conditioning', 'Reclining Seats'];
    destinations: string[] = ['Thimphu','Paro','Punakha','Trongsa','Bumthang','Haa'];

  constructor(
    private formBuilder: FormBuilder,
    private busService: BusService,
    private route: ActivatedRoute,
    private router: Router,
          private toastr: ToastrService
    
  ) {
    this.busForm = this.formBuilder.group({
      busNo: ['', Validators.required],
      seatsAvailability: [null, [Validators.required, Validators.min(1)]],
      departureFrom: ['', Validators.required],
      destination: ['', Validators.required],
      departure: ['', Validators.required],
      model: ['', Validators.required],
      brand: ['', Validators.required],
      amenities: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.busId = this.route.snapshot.paramMap.get('id');
    if (this.busId) {
      this.loadBusData(this.busId);
    }
  }

  loadBusData(busId: string): void {
    this.loading = true;
    this.busService.getBusbyId(busId).subscribe(
        (response: any) => { 
            console.log(response); 
            if (response.status) {
                const bus = response.data.bus; 
                this.busForm.patchValue({
                    busNo: bus.busNo,
                    seatsAvailability: bus.seatsAvailability,
                    departureFrom: bus.departureFrom,
                    destination: bus.destination,
                    departure: bus.departure,
                    model: bus.model,
                    brand: bus.brand,
                    amenities: bus.amenities,
                    price: bus.price
                });
            } else {
                this.errorMessage = 'Bus data not found.';
            }
            this.loading = false;
        },
        (error) => {
            this.loading = false;
            this.errorMessage = 'Error loading bus data: ' + error.message;
        }
    );
}
  onSubmit(): void {
    if (this.busForm.valid) {
      if (this.busId) {
        this.loading = true;
        this.busService.updateBus(this.busId, this.busForm.value).subscribe(
          (response: Bus) => {
            this.loading = false;
            this.toastr.success('Bus Updated Sucessfully', 'Success');
            this.errorMessage = null;
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            this.loading = false;
            this.errorMessage = 'Error updating bus: ' + error.message;
            this.successMessage = null;
          }
        );
      } else {
        this.errorMessage = 'Bus ID is required for updating.';
      }
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
  onDelete(): void {
    if (this.busId) {
        const confirmDelete = confirm('Are you sure you want to delete this bus?');
        if (confirmDelete) {
            this.loading = true;
            this.busService.deleteBusbyId(this.busId).subscribe(
                () => {
                    console.log('Bus deleted successfully!');
                    this.toastr.success('Bus deleted successfully!', 'Success');
                    this.errorMessage = null;

                    this.router.navigateByUrl('/dashboard').then(success => {
                        if (success) {
                            console.log('Navigation to dashboard successful');
                        } else {
                            console.error('Navigation to dashboard failed');
                        }
                    });
                },
                (error) => {
                    console.error('Error deleting bus:', error); 
                    this.errorMessage = 'Error deleting bus: ' + error.message;
                    this.successMessage = null;
                },
                () => {
                    this.loading = false;
                    console.log('Loading state set to false'); 
                }
            );
        }
    } else {
        this.errorMessage = 'Bus ID is required for deletion.';
    }
}
}
