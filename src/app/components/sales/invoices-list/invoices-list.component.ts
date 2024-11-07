import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [InvoiceService],
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.css'
})
export class InvoicesListComponent implements OnInit {
  invoiceList: any[] = []; // Define invoiceList to store invoice data
  invoiceIdToDelete: number | null = null;

  constructor(private invoiceService: InvoiceService, private router: Router) { }

  ngOnInit(): void {
    this.GetInvoices();
  }

  // GetInvoices method
  GetInvoices() {
    this.invoiceService.GetInvoices().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.invoiceList = res.data; // Assign invoice data to invoiceList
        }
      },
      error: (err: any) => {
        console.error('Error fetching invoices:', err);
      }
    });
  }

  // Edit invoice
  editInvoice(invoice: any) {
    this.router.navigate(['/admin/sales/invoices-edit/', invoice.id], {
      state: { invoiceData: invoice } // Pass invoice data as state
    });
  }

  // Store the invoice ID to be deleted
  openDeleteConfirmation(invoiceId: number): void {
    this.invoiceIdToDelete = invoiceId;

    // Show confirmation alert
    const confirmation = window.confirm('Are you sure you want to delete this invoice?');

    if (confirmation && this.invoiceIdToDelete !== null) {
      this.deleteInvoice();
    }
  }

  // Call the delete API when deletion is confirmed
  deleteInvoice(): void {
    if (this.invoiceIdToDelete !== null) {
      this.invoiceService.DeleteInvoice(this.invoiceIdToDelete).subscribe({
        next: (response) => {
          this.GetInvoices();
          console.log('Invoice deleted successfully:', response);
        },
        error: (error) => {
          console.error('Error deleting invoice:', error);
        }
      });
    }
  }
}