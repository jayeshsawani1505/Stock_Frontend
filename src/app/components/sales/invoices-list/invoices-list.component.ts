import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { ExcelService } from '../../../services/excel.service';
import { DeleteInvoiceComponent } from './delete-invoice/delete-invoice.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule],
  providers: [InvoiceService],
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.css'
})
export class InvoicesListComponent implements OnInit {
  invoiceList: any[] = []; // Define invoiceList to store invoice data
  invoiceIdToDelete: number | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  InvoiceTotal: any;
  dataForExcel: any[] = [];

  constructor(private invoiceService: InvoiceService,
    private ExcelService: ExcelService, public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.GetInvoices();
    this.getInvoiceTotalsByStatus();
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

  // getInvoiceTotalsByStatus method
  getInvoiceTotalsByStatus() {
    this.invoiceService.getInvoiceTotalsByStatus().subscribe({
      next: (res: any) => {
        this.InvoiceTotal = res.data;
        console.log(res);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Check if input and input.files are not null
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.invoiceService.UploadExcel(file).subscribe(
        response => {
          this.GetInvoices();
          console.log('File uploaded successfully', response);
        },
        error => {
          console.error('File upload failed', error);
        }
      );
    } else {
      console.error('No file selected');
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/profiles/avatar-14.jpg';
  }

  // Edit invoice
  editInvoice(invoice: any) {
    this.router.navigate(['/admin/sales/invoices-edit/', invoice.id], {
      state: { invoiceData: invoice } // Pass invoice data as state
    });
  }

  // Store the invoice ID to be deleted
  openDeleteConfirmation(invoiceId: number): void {
    const dialogRef = this.dialog.open(DeleteInvoiceComponent, {
      data: invoiceId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetInvoices();
    });
  }

  excelDownload(title: string) {
    // Assuming invoiceList contains the list of invoices
    let dataToExport = this.invoiceList.map((x: any) => ({
      invoice_number: x.invoice_number,
      customer_name: x.customer_name,
      customer_phone: x.customer_phone,
      invoice_date: x.invoice_date,
      due_date: x.due_date,
      reference_number: x.reference_number,
      status: x.status,
      recurring: x.recurring,
      recurring_cycle: x.recurring_cycle,
      product_id: x.product_id,
      quantity: x.quantity,
      unit: x.unit,
      rate: x.rate,
      total_amount: x.total_amount,
      notes: x.notes,
      terms_conditions: x.terms_conditions,
      created_at: x.created_at,
      category_name: x.category_name,
    }));

    // Prepare the data to export by converting each row to its values
    this.dataForExcel = []; // Clear previous data
    dataToExport.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row));
    });

    console.log(this.dataForExcel);

    // Extract header names dynamically from the keys of the first object
    let headers = Object.keys(dataToExport[0]);

    // Define the report data with headers and data
    let reportData = {
      data: this.dataForExcel,
      headers: headers, // Use keys as headers
      title: title
    };

    // Call the Excel service to generate the excel file
    this.ExcelService.generateExcel(reportData);

    // Clear data after export
    this.dataForExcel = [];
  }

}