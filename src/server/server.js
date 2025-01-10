import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import pdfkit from 'pdfkit';
import fs from 'fs';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.post('/send-email', (req, res) => {
  console.log('Request body:', req.body);
  const { ticketData, userEmail } = req.body;
  console.log('Ticket data:', ticketData);
  console.log('User   email:', userEmail);

  if (!ticketData) {
    console.log('Error: ticketData is undefined');
    res.status(500).send({ message: 'Error sending email' });
    return;
  }

  const pdfDoc = new pdfkit();
  pdfDoc.fontSize(25).text('Ticket Information', 100, 100);
  pdfDoc.fontSize(18).text(`Seat No: ${ticketData.seatNo}`, 100, 150);
  pdfDoc.fontSize(18).text(`User  ID: ${ticketData.userId}`, 100, 200);
  pdfDoc.fontSize(18).text(`Departure Location: ${ticketData.departureLocation}`, 100, 250);
  pdfDoc.fontSize(18).text(`Ticket Price: ${ticketData.ticketPrice}`, 100, 300);
  pdfDoc.fontSize(18).text(`Destination: ${ticketData.destination}`, 100, 300); // Added Destination
  pdfDoc.fontSize(18).text(`Time: ${ticketData.departureTime}`, 100, 350); // Added Time
  pdfDoc.end();

  const pdfBuffer = [];
  pdfDoc.on('data', (chunk) => {
    pdfBuffer.push(chunk);
  });
  pdfDoc.on('end', () => {
    const pdf = Buffer.concat(pdfBuffer);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // or 'STARTTLS'
      auth: {
        user: '',
        pass: ''
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: userEmail,
      subject: 'Ticket Information',
      text: 'Please find the ticket information attached.',
      attachments: [
        {
          filename: 'ticket.pdf',
          content: pdf,
          encoding: 'base64',
          contentType: 'application/pdf'
        }
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.send({ message: 'Email sent successfully' });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});