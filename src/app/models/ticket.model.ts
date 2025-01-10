// ticket.model.ts
export interface Ticket {
    id: number;                
    busNo: string;            
    seatNo: number;           
    destination: string;      
    departureFrom: string;    
    price: number;            
    model: string;            
    brand: string;            
    amenities: string;        
    departure: string;        
    userId: string;          
}