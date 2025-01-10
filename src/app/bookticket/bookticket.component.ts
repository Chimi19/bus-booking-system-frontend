import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Ticket } from 'app/models/ticket.model';
import { BusService } from 'app/services/bus.service';
import { SendTicketService } from 'app/services/sendTicket.service';
import { TicketService } from 'app/services/ticket.service';
import { UserService } from 'app/services/user.service';
import { ToastrService } from 'ngx-toastr';
interface Seat{
  number:string;
  selected:boolean;
  occupied:boolean;
}
@Component({
  selector: 'app-bookticket',
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  standalone:true,
  templateUrl: './bookticket.component.html',
  styleUrl: './bookticket.component.css'
})

export class BookticketComponent {
  
  
  ticketForm: FormGroup;
  busForm: FormGroup;
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  busId: string | null = null;
  seatMap:Seat[][] = [];
  ticketData: any;
  userEmail: string|null = null;

seatAvalability:number = 0;
  models: string[] = ['Minibus', 'Single-decker bus', 'School bus'];
  brands: string[] = ['Volvo', 'Suzuki', 'Toyota'];
  amenitiesOptions: string[] = ['WiFi', 'Air Conditioning', 'Reclining Seats'];
  destinations: string[] = ['Thimphu', 'Paro', 'Punakha', 'Trongsa', 'Bumthang', 'Haa'];
  seatRows: Seat[][] = []; // Group seats into rows for better UI
  selectedSeat: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private busService: BusService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private sendEmail:SendTicketService,
    private http: HttpClient
  ) {
    this.busForm = this.formBuilder.group({
      busNo: [{ value: '', disabled: true }, Validators.required],
      seatsAvailability: [{ value: '', disabled: true }, [Validators.required, Validators.min(1)]],
      departureFrom: [{ value: '', disabled: true }, Validators.required],
      destination: [{ value: '', disabled: true }, Validators.required],
      departure: [{ value: '', disabled: true }, Validators.required],
      model: [{ value: '', disabled: true }, Validators.required],
      brand: [{ value: '', disabled: true }, Validators.required],
      amenities: [{ value: '', disabled: true }, Validators.required],
      price: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  
    this.ticketForm = this.formBuilder.group({
      busNo: [{ value: '', disabled: true }, Validators.required], // Disable busNo
      seatNo: [{ value: [], disabled: false }, Validators.required], // Update seatNo to accept an array of values
      destination: [{ value: '', disabled: true }, Validators.required], // Disable destination
      departureFrom: [{ value: '', disabled: true }, Validators.required], // Disable departureFrom
      price: [{value: '', disabled:true}, [Validators.required, Validators.min(0),]], // Disable price
      model: [{ value: '', disabled: true }, Validators.required], // Disable model
      brand: [{ value: '', disabled: true }, Validators.required], // Disable brand
      amenities: [{ value: '', disabled: true }, Validators.required], // Disable amenities
      departure: [{ value: '', disabled: true }, Validators.required], // Disable departure
      userId: [ Validators.required] // Keep userId enabled if needed
    });
  }

  ngOnInit(): void {
    this.busId = this.route.snapshot.paramMap.get('id');
    if (this.busId) {
      this.loadBusData(this.busId);
    }
    const currentUser  = this.userService.getCurrentUser ();
    if (currentUser ) {
      this.ticketForm.patchValue({
        userId: currentUser .id // Ensure this is set correctly
      });
    } else {
      this.errorMessage = 'User  not logged in.';
    }
    this.generateSeatMap(this.busId!);
  }

  generateSeatMap(busId: string) {
    let bus: any; // Declare bus here
    
    this.busService.getBusbyId(busId).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status) {
          bus = response.data.bus; // Assign bus here
    
          // Initialize seatMap with seat numbers and occupied status
          const occupiedSeats: string[] = [];
          const seatsPerRow = 4; // Define how many seats per row
          for (let i = 0; i < bus.seatsAvailability; i++) {
            const seatNumber = (i + 1).toString();
            const isOccupied = occupiedSeats.includes(seatNumber);
            if (i % seatsPerRow === 0) {
              this.seatMap.push([{ number: seatNumber, selected: false, occupied: isOccupied }]);
            } else {
              this.seatMap[this.seatMap.length - 1].push({ number: seatNumber, selected: false, occupied: isOccupied });
            }
          }
          this.groupSeatsIntoRows(); // Group seats into rows for UI
        }
      }
    );
  }

  groupSeatsIntoRows() {
    const seatsPerRow = 4; // Define how many seats per row
    this.seatRows = this.seatMap;
  }
  selectSeat(seat: Seat): void {
    if (!seat.occupied && !seat.selected) {
      // Add the seat to the selected seats list
      this.selectedSeat.push(seat.number);
      seat.selected = true;
  
      // Update the form or any other logic
      this.ticketForm.patchValue({ seatNo: this.selectedSeat[0] }); // Assign the first selected seat number
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

          // Patch bus data to ticket form
          this.ticketForm.patchValue({
            busNo: bus.busNo,
            model: bus.model,
            brand: bus.brand,
            amenities: bus.amenities,
            price: bus.price,
            departureFrom: bus.departureFrom,
            destination: bus.destination,
            departure: bus.departure,
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
    this.ticketData = {
      ...this.ticketForm.value,
      departureLocation: this.ticketForm.get('departureFrom')?.value,
      ticketPrice: this.ticketForm.get('price')?.value,
    };
    this.busForm.enable();
    this.ticketForm.enable();
    const userEmail = this.userService.getCurrentUser()?.email;

    if (userEmail) {
      this.http.post('http://localhost:3001/send-email', {
        ticketData: this.ticketData,
        userEmail: userEmail
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .subscribe((response) => {
        console.log(response);
      });
    }
    console.log('Form Valid:', this.ticketForm.valid);
    console.log('Form Errors:', this.ticketForm.errors);
    console.log('Form Controls:', this.ticketForm.controls);
  
    // Log each control's validity and errors
    Object.keys(this.ticketForm.controls).forEach(controlName => {
      const control = this.ticketForm.get(controlName);
      console.log(`${controlName} - Valid: ${control?.valid}, Errors: ${control?.errors}`);
    });
  
    if (this.ticketForm.valid) {
      this.loading = true;
  
      const ticketData = {
        ...this.ticketForm.value,
      };
  
      console.log('Ticket Data:', ticketData); // Log the ticket data
  
      this.ticketService.addTicket(ticketData).subscribe(
        (response: Ticket) => {
          this.loading = false;
          this.toastr.success('Ticket Booked Successfully', 'Success');
          this.errorMessage = null;
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Error booking ticket: ' + error.message;
          this.successMessage = null;
        }
      );
    } else {
      this.toastr.error('Please fill out the form correctly.', 'Error');
    }
  }

}
