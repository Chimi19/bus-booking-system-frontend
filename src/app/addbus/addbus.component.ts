import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Bus } from 'app/models/bus.model';
import { BusService } from 'app/services/bus.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addbus',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './addbus.component.html',
  styleUrl: './addbus.component.css'
})
export class AddbusComponent {

    busForm: FormGroup;
     addedBus: Bus | null = null; 
     models: string[] = ['Minibus', 'Single-decker bus', 'School bus'];
     brands: string[] = ['Volvo', 'Suzuki', 'Toyota'];
     amenitiesOptions: string[] = ['WiFi', 'Air Conditioning', 'Reclining Seats'];
     destinations: string[] = ['Thimphu','Paro','Punakha','Trongsa','Bumthang','Haa'];
 
    constructor(
      private formBuilder: FormBuilder,
      private busService: BusService,
      private router: Router,
      private toastr: ToastrService
    ){
      this.busForm = this.formBuilder.group({
        busNo: ['', Validators.required],                     
        seatsAvailability: [null, Validators.required],       
        departureFrom: ['', Validators.required],           
        destination: ['', Validators.required],              
        departure: ['', Validators.required],                
        model: ['', Validators.required],                   
        brand: ['', Validators.required],                     
        amenities: ['', Validators.required],  
        price: ['', Validators.required]   ,
        date:['', Validators.required]          
      });
      }
       onSubmit(): void {
      
        if (this.busForm.valid) {
          // Create busData from the form values
          const time = this.busForm.value.departure;
          const hours = time.split(' ')[0].split(':')[0];
          const minutes = time.split(' ')[0].split(':')[1];
          const ampm = time.split(' ')[1];
          let formattedHours = hours;
          if (ampm === 'PM' && hours !== '12') {
            formattedHours = (parseInt(hours) + 12).toString();
          } else if (ampm === 'AM' && hours === '12') {
            formattedHours = '00';
          }
          const formattedTime = `${formattedHours}:${minutes}:00`;
          const busData: Bus = {
              id: this.busForm.value.id,
              busNo: this.busForm.value.busNo,
              seatsAvailability: this.busForm.value.seatsAvailability,
              departureFrom: this.busForm.value.departureFrom,
              destination: this.busForm.value.destination,
              departure: formattedTime,
              model: this.busForm.value.model,
              brand: this.busForm.value.brand,
              amenities: this.busForm.value.amenities,
              price: this.busForm.value.price,
              date: this.busForm.value.date,
          };
  
          this.busService.addBus(busData).subscribe(
              response => {
                  console.log('Bus added successfully:', response);
                  this.toastr.success('Bus Added Sucessfully', 'Success');
        this.router.navigate(['dashboard']);
              },
              error => {
                  console.error('Error adding bus:', error);
              }
          );
      } else {
          console.log('Form is invalid');
      }
        
        }
}
