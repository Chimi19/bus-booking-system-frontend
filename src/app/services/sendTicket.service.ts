// ticket.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class SendTicketService {

  private apiUrl = 'http://localhost:3001/send-email';

  constructor(private http: HttpClient) { }

  async sendTicketEmail(ticketData: any, userEmail: string) {
    // Generate the PDF
    const pdf = new (jsPDF as any)('p', 'mm', [291, 210]);
    pdf.text('Ticket Information', 10, 10);
    pdf.text(`Bus No: ${ticketData.busNo}`, 10, 20);
    pdf.text(`Departure From: ${ticketData.departureFrom}`, 10, 30);
    pdf.text(`Destination: ${ticketData.destination}`, 10, 40);
    pdf.text(`Departure Time: ${ticketData.departureTime}`, 10, 50);
    pdf.text(`Price: ${ticketData.price}`, 10, 60);

    // Save the PDF as a blob
    const pdfBlob = new Blob([pdf.output()], { type: 'application/pdf' });

    // Send the PDF as an email attachment
    const data = {
      ticketData: {
        busNo: ticketData.busNo,
        departureFrom: ticketData.departureFrom,
        destination: ticketData.destination,
        departureTime: ticketData.departureTime,
        price: ticketData.price,
        pdfBlob: await pdfBlob.text()
      },
      userEmail: userEmail
    };

    return this.http.post(this.apiUrl, data).toPromise();
  }
}