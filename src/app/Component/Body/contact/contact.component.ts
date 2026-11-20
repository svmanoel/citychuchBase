import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  // API endpoint
  private readonly API_URL =
    'https://api.citychurchliverpool.org/api/email/send';

  // Contact form data
  contact = {
    name: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  };

  // Form status
  isSending = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  // Send contact form
  sendMessage(form: NgForm): void {

    this.successMessage = '';
    this.errorMessage = '';

    // Check form validation
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSending = true;

    // Prepare request data
    const emailData = {
      name: this.contact.name.trim(),
      email: this.contact.email.trim(),
      phoneNumber: this.contact.phoneNumber.trim(),
      subject: this.contact.subject.trim(),
      message: this.contact.message.trim()
    };

    // Send request to Node.js API
    this.http.post<any>(this.API_URL, emailData).subscribe({

      next: (response) => {

        this.isSending = false;

        this.successMessage =
          'Thank you for contacting us! Your message has been sent successfully.';

        // Reset form after successful submission
        form.resetForm({
          name: '',
          email: '',
          phoneNumber: '',
          subject: '',
          message: ''
        });

      },

      error: (error) => {

        console.error('Email sending error:', error);

        this.isSending = false;

        this.errorMessage =
          'Sorry, we could not send your message. Please try again later or contact us by email.';

      }

    });

  }

}