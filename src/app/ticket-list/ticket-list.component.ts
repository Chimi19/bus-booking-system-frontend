import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Bus } from 'app/models/bus.model';
import { Ticket } from 'app/models/ticket.model';
import { BusService } from 'app/services/bus.service';
import { TicketService } from 'app/services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  imports: [CommonModule,FormsModule, RouterLink],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit{
  tickets: Ticket[] = []; // Array to hold user tickets
  bus: Bus[] = [];
  loading: boolean = false; // Loading state
  errorMessage: string | null = null; // Error message
  minDate: string = '';
  filteredBus: Bus[] = []; // Array to hold filtered bus data
  isSubmitted: boolean = false; // Track if the form has been submitted
  selectedLocation: string = ''; // Selected location from dropdown
  selectedDeparture: string = ''; // Selected departure from dropdown
  selectedDate: string = ''; // Selected date

  constructor(private ticketService: TicketService, private busService: BusService) {}

  ngOnInit(): void {
    this.loadUserTickets(); // Load user tickets on component initialization
    this.loadBusData();
    this.setMinDate();
  }

  setMinDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  }

  // Method to load user tickets
  loadUserTickets(): void {
    this.loading = true; // Set loading state to true
    this.ticketService.getUserTickets().subscribe(
      (tickets:any[]) => {
        this.tickets =tickets.map(ticket => ({
          ...ticket,
          id: Number(ticket.id) // Convert id to a number
      })); 

        this.loading = false; // Set loading state to false
      },
      (error) => {
        console.error('Error fetching user tickets:', error); // Log error to console
        this.errorMessage = 'Failed to load tickets. Please try again.'; // Set error message
        this.loading = false; // Set loading state to false
      }
    );
  }


  filterBusData(): void {
    this.isSubmitted = true;
    console.log('Filtering bus data...');
    console.log('Selected Location:', this.selectedLocation);
    console.log('Selected Departure:', this.selectedDeparture);
    console.log('Selected Date:', this.selectedDate);
  
    this.filteredBus = this.bus.filter(bus => 
      bus.departureFrom === this.selectedLocation &&
      bus.destination === this.selectedDeparture &&
      bus.date === this.selectedDate
    );
  
    console.log('Filtered Bus Data:', this.filteredBus);
  }
  loadBusData(): void {
    this.busService.getBus().subscribe(
      (bus: Bus[]) => {
        this.bus = bus; // Populate the bus array
      },
      (error) => {
        console.error('Error fetching bus data:', error); // Log error to console
        this.errorMessage = 'Failed to load bus data. Please try again.'; // Set error message
      }
    );
  }



//   onDelete(id: number): void {
//     if (confirm('Are you sure you want to delete this ticket?')) {
//         this.ticketService.deleteUserTicket(id.toString()).subscribe(
//             (response) => {
//                 console.log('Ticket deleted:', response);
//                 this.tickets = this.tickets.filter(ticket => ticket.id !== id);
//             },
//             (error) => {
//                 console.error('Error deleting ticket:', error);
//                 this.errorMessage = 'Failed to delete ticket. Please try again.';
//             }
//         );
//     }
// }
}
