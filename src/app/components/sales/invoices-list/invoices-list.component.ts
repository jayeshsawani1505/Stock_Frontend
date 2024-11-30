import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { ExcelService } from '../../../services/excel.service';
import { InvoiceService } from '../../../services/invoice.service';
import { ChangeInvoiceStatusComponent } from './change-invoice-status/change-invoice-status.component';
import { DeleteInvoiceComponent } from './delete-invoice/delete-invoice.component';
import moment from 'moment';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule, MatSnackBarModule
  ],
  providers: [InvoiceService],
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.css'
})
export class InvoicesListComponent implements OnInit {
  invoiceList: any[] = []; // Define invoiceList to store invoice data
  @ViewChild('fileInput') fileInput!: ElementRef;
  InvoiceTotal: any;
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['id', 'invoice_number', 'customer_name', 'total_amount', 'due_date', 'status', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private invoiceService: InvoiceService,
    private ExcelService: ExcelService, public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.GetInvoices();
    this.getInvoiceTotalsByStatus();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  GetInvoices() {
    this.invoiceService.GetInvoices().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.invoiceList = res.data; // Assign invoice data to invoiceList
          this.dataSource.data = this.invoiceList;
        }
      },
      error: (err: any) => {
        console.error('Error fetching invoices:', err);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  getInvoiceDetailsForPDF(invoiceId: number) {
    this.invoiceService.getInvoiceDetailsForPDF(invoiceId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.generatePDF(res.data)
      },
      error: (err: any) => {
        console.error('Error fetching invoices:', err);
      }
    });
  }

  // Apply the filter for invoice search
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
          this.getInvoiceTotalsByStatus();
          console.log('File uploaded successfully', response);
          this.openSnackBar('Upload Successfully', 'Close');
        },
        error => {
          console.error('File upload failed', error);
          this.openSnackBar('error', 'Close');
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
      this.getInvoiceTotalsByStatus();
    });
  }

  openChangeStatus(data: number): void {
    const dialogRef = this.dialog.open(ChangeInvoiceStatusComponent, {
      data: data,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetInvoices();
      this.getInvoiceTotalsByStatus()
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

  async generatePDF(data: any) {
    const invoiceDetails = data.invoice_details;

    let docDefinition: any = {
      content: [
        {
          columns: [
            [
              {
                text: 'PEC Trading Pvt Ltd',
                fontSize: 16,
                bold: true,
                color: '#4e50d3',
                margin: [0, 0, 0, 10],
              },
            ],
            [
              {
                text: 'INVOICE',
                fontSize: 24,
                bold: true,
                alignment: 'right',
                color: '#4e50d3',
              },
              {
                text: `Invoice No: ${data.invoice_number}\nInvoice Date: ${formatDate(data.invoice_date) || 'Not Available'}\nDue Date: ${formatDate(data.due_date) || 'Not Available'}`,
                fontSize: 10,
                alignment: 'right',
                margin: [0, 10, 0, 0],
              }
            ],
          ],
        },
        { text: 'Customer Information', style: 'sectionHeader', margin: [0, 20, 0, 10] },
        {
          columns: [
            [
              { text: 'Customer Details:', bold: true },
              { text: data.name },
              { text: `GSTIN: ${data.gstin || 'Not Available'}` },
              { text: `Payment Status: ${data.status}`, color: data.status === 'paid' ? 'green' : 'red' },
            ],
            [
              { text: 'Billing Address:', bold: true },
              { text: `${data.billing_name}` },
              { text: `${data.billing_address_line1}, ${data.billing_address_line2}, ${data.billing_city}, ${data.billing_state}, ${data.billing_country} - ${data.billing_pincode}` },
            ],
            [
              { text: 'Shipping Address:', bold: true },
              { text: `${data.shipping_name}` },
              { text: `${data.shipping_address_line1}, ${data.shipping_address_line2}, ${data.shipping_city}, ${data.shipping_state}, ${data.shipping_country} - ${data.shipping_pincode}` },
            ],
          ]
        },
        { text: ' ', margin: [0, 10] },
        {
          style: 'tableExample',
          table: {
            widths: [20, '*', 60, 60, 60, 60],
            body: [
              [
                { text: '#', bold: true, alignment: 'center' },
                { text: 'Item', bold: true },
                { text: 'Quantity', bold: true },
                { text: 'Unit', bold: true },
                { text: 'Unit Price', bold: true },
                { text: 'Amount', bold: true },
              ],
              // Dynamically add rows here
              ...invoiceDetails.map((item: any, index: number) => [
                { text: index + 1, alignment: 'center' },
                { text: `${item.category_name} - ${item.product_name}` },
                { text: item.quantity },
                { text: item.unit },
                { text: ` ${item.rate}`, alignment: 'right' },
                { text: ` ${item.subtotal_amount}`, alignment: 'right' },
              ]),
            ],
          },
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                body: [
                  [
                    { text: 'Total Amount:', alignment: 'right', bold: true },
                    { text: `${data.subtotal_amount}`, alignment: 'right', bold: true }
                  ],
                  [
                    { text: 'Adjustment Value:', alignment: 'right', bold: true },
                    { text: `${data.adjustmentValue}`, alignment: 'right', bold: true }
                  ],
                  [
                    { text: 'Grand Total:', alignment: 'right', bold: true },
                    { text: `${data.total_amount}`, alignment: 'right', bold: true }
                  ]
                ]
              },
              layout: 'noBorders',
            }
          ],
          margin: [0, 10, 0, 10]
        },
        {
          columns: [
            [
              { text: 'Terms & Conditions:', bold: true },
              { text: data.terms_conditions || 'Not Available' },
            ]
          ],
          margin: [0, 20, 0, 0]
        },
        { text: 'Thanks for your Business', alignment: 'center', margin: [0, 20, 0, 0], fontSize: 12, bold: true },
      ],
      styles: {
        sectionHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
      }
    };

    pdfMake.createPdf(docDefinition).open();
    // pdfMake.createPdf(docDefinition).download('Invoice.pdf');
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}

function formatDate(date: moment.MomentInput) {
  return date ? moment(date).format('DD-MMM-YYYY') : null;
}