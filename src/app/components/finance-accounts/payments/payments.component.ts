import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { ExcelService } from '../../../services/excel.service';
import { PaymentService } from '../../../services/payments.service';
import { AddEditPaymentComponent } from './add-edit-payment/add-edit-payment.component';
import { DeletePaymentComponent } from './delete-payment/delete-payment.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule, MatSnackBarModule
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})

export class PaymentsComponent implements OnInit, AfterViewInit {
  paymentsList: any[] = [];
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['index', 'payment_id', 'customer_id', 'customer_name', 'amount', 'payment_mode', 'payment_date', 'payment_status', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private PaymentService: PaymentService,
    private ExcelService: ExcelService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.GetPayments();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!; // Assign paginator to data source after view initialization
  }

  GetPayments(): void {
    this.PaymentService.GetPayments().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.payments) {
          this.paymentsList = res.payments; // Assign the Payment data to paymentsList
          this.dataSource.data = this.paymentsList; // Assign the data to MatTableDataSource
        }
      },
      error: (err: any) => {
        console.error('Error fetching categories:', err);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  // Apply filter to search
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to the first page after applying the filter
    }
  }


  // Open the edit modal with the selected Payment
  openAddPayment() {
    const dialogRef = this.dialog.open(AddEditPaymentComponent, {
      width: '550px', // Adjust width as needed
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetPayments();
      // Handle any actions after the dialog closes
    });
  }

  openEditPayment(data: any) {
    const dialogRef = this.dialog.open(AddEditPaymentComponent, {
      width: '550px', // Adjust width as needed
      data: data // Pass any data if required
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetPayments();
      // Handle any actions after the dialog closes
    });
  }


  // Open delete confirmation with the selected Payment's ID
  openDeletePayment(PaymentId: number): void {
    const dialogRef = this.dialog.open(DeletePaymentComponent, {
      data: PaymentId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetPayments();
    });
  }

  excelDownload(title: string) {
    // Assuming categoryList contains the list of categories
    let dataToExport = this.paymentsList.map((x: any) => ({
      payment_id: x.payment_id,
      customer_name: x.customer_name,
      amount: x.amount,
      payment_mode: x.payment_mode || 'N/A', // Provide default value if payment_mode is empty
      payment_date: x.payment_date,
      payment_status: x.payment_status,
      description: x.description,
      created_at: x.created_at,
    }));

    // Prepare the data to export by converting each row to its values
    this.dataForExcel = []; // Make sure to clear previous data
    dataToExport.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row));
    });

    console.log(this.dataForExcel);

    // Extract the header names dynamically from the keys of the first object
    let headers = Object.keys(dataToExport[0]);

    // Define the report data with the headers and corresponding data
    let reportData = {
      data: this.dataForExcel,
      headers: headers, // Dynamically use the keys as headers
      title: title
    };

    // Call the Excel service to generate the excel file
    this.ExcelService.generateExcel(reportData);

    // Clear the data after exporting
    this.dataForExcel = [];
  }

  async generatePDF(data: any) {
    console.log(data);

    const invoiceDetails = JSON.parse(data.invoice_details || "[]");

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
                text: 'PAYMENT SLIP',
                fontSize: 24,
                bold: true,
                alignment: 'right',
                color: '#4e50d3',
              },
              {
                text: `Invoice No: ${data.invoice_number || 'Not Available'}\nPayment Date: ${data.payment_date || 'Not Available'
                  }`,
                fontSize: 10,
                alignment: 'right',
                margin: [0, 10, 0, 0],
              },
            ],
          ],
        },
        {
          columns: [
            [
              { text: 'Payment Details:', bold: true, margin: [0, 0, 0, 5] },
              { text: `Payment Mode: ${data.payment_mode || 'Not Available'}`, margin: [0, 0, 0, 5] },
              { text: `Payment Date: ${data.payment_date || 'Not Available'}`, margin: [0, 0, 0, 5] },
              { text: `Amount Paid: INR ${data.amount || 0}`, margin: [0, 0, 0, 5] },
            ],
          ],
          columnGap: 20,
          margin: [0, 20, 0, 10],
        },
        {
          text: 'Invoice Details',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10],
        },
        {
          style: 'tableExample',
          table: {
            widths: [20, '*', 60, 50, 60],
            body: [
              [
                { text: '#', bold: true, alignment: 'center' },
                { text: 'Item', bold: true },
                { text: 'Quantity', bold: true },
                { text: 'Unit Price', bold: true },
                { text: 'Amount', bold: true },
              ],
              ...invoiceDetails.map((item: any, index: number) => [
                { text: index + 1, alignment: 'center' },
                { text: `${item.product_name || 'Product'} ${item.subproduct_name ? `- ${item.subproduct_name}` : ''}` },
                { text: item.quantity || 'N/A' },
                { text: `INR ${item.rate || 0}`, alignment: 'right' },
                { text: `INR ${item.total_amount || 0}`, alignment: 'right' },
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
                  [{ text: 'Total Amount:', alignment: 'right', bold: true }, { text: `INR ${data.total_amount}`, alignment: 'right', bold: true }],
                ],
              },
              layout: 'noBorders',
            },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          columns: [
            [
              { text: 'Payment Info:', bold: true },
              { text: `Amount: INR ${data.amount || 0}` },
              { text: `Payment Status: ${data.payment_status || 'Not Available'}`, color: data.payment_status === 'paid' ? 'green' : 'red' },
            ],
            [
              { text: 'Terms & Conditions:', bold: true },
              { text: data.terms_conditions || 'Not Available' },
            ],
          ],
          margin: [0, 20, 0, 0],
        },
        { text: 'Thanks for your Payment!', alignment: 'center', margin: [0, 20, 0, 0], fontSize: 12, bold: true },
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
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}
