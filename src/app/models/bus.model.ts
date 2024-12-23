export interface Bus {
    id:number;
    busNo: string;                
    seatsAvailability: number | null; 
    departureFrom: string;        
    destination: string;           
    departure: string;              
    model: string;                  
    brand: string;                  
    amenities: string;              
    price: number;
}