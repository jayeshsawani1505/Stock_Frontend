import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { ExcelService } from '../../../services/excel.service';
import { PurchasePaymentsService } from '../../../services/PurchasePayment.service';
import { AddEditPurchasePaymentComponent } from './add-edit-purchase-payment/add-edit-purchase-payment.component';
import { DeletePurchasePaymentComponent } from './delete-purchase-payment/delete-purchase-payment.component';

@Component({
  selector: 'app-purchase-payment',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule, MatSnackBarModule
  ],
  templateUrl: './purchase-payment.component.html',
  styleUrl: './purchase-payment.component.css'
})
export class PurchasePaymentComponent implements OnInit, AfterViewInit {
  paymentsList: any[] = [];
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['index', 'payment_id', 'vendor_name', 'amount', 'pendingAmount', 'receiveAmount', 'payment_mode', 'payment_status', 'payment_date', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private PurchasePaymentsService: PurchasePaymentsService,
    private ExcelService: ExcelService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getPurchasePayments();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!; // Assign paginator to data source after view initialization
  }

  getPurchasePayments(): void {
    this.PurchasePaymentsService.getPurchasePayments().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res) {
          this.paymentsList = res; // Assign the Payment data to paymentsList
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
    const dialogRef = this.dialog.open(AddEditPurchasePaymentComponent, {
      width: '550px', // Adjust width as needed
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getPurchasePayments();
      // Handle any actions after the dialog closes
    });
  }

  openEditPayment(data: any) {
    const dialogRef = this.dialog.open(AddEditPurchasePaymentComponent, {
      width: '550px', // Adjust width as needed
      data: data // Pass any data if required
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getPurchasePayments();
      // Handle any actions after the dialog closes
    });
  }


  // Open delete confirmation with the selected Payment's ID
  openDeletePayment(PaymentId: number): void {
    const dialogRef = this.dialog.open(DeletePurchasePaymentComponent, {
      data: PaymentId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getPurchasePayments();
    });
  }

  excelDownload(title: string) {
    // Assuming categoryList contains the list of categories
    let dataToExport = this.paymentsList.map((x: any) => ({
      payment_id: x.payment_id,
      vendor_name: x.vendor_name,
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
  generatePDF(data: any) {
    const docDefinition: any = {
      content: [
        // Header Section
        {
          columns: [
            {
              text: 'PEC Trading Pvt Ltd',
              fontSize: 20,
              bold: true,
              color: '#4e50d3',
            },
            {
              text: 'PURCHASE SLIP',
              fontSize: 24,
              bold: true,
              color: '#4e50d3',
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Divider Line
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, color: '#4e50d3' }],
          margin: [0, 0, 0, 10],
        },

        // Payment Details Section
        {
          text: 'Payment Details',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10],
        },
        {
          table: {
            widths: ['35%', '65%'],
            body: [
              [
                { text: 'Purchase ID:', bold: true, margin: [0, 5, 0, 5] },
                { text: data.payment_id || 'Not Available', margin: [0, 5, 0, 5] },
              ],
              [
                { text: 'Vendor Name:', bold: true, margin: [0, 5, 0, 5] },
                { text: data.vendor_name || 'Not Available', margin: [0, 5, 0, 5] },
              ],
              [
                { text: 'Payment Date:', bold: true, margin: [0, 5, 0, 5] },
                {
                  text: data.payment_date
                    ? new Date(data.payment_date).toLocaleDateString()
                    : 'Not Available',
                  margin: [0, 5, 0, 5],
                },
              ],
              [
                { text: 'Payment Status:', bold: true, margin: [0, 5, 0, 5] },
                {
                  text: data.payment_status || 'Not Available',
                  color: data.payment_status === 'paid' ? 'green' : 'red',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
        },

        // Invoice Details Section
        {
          text: 'Purchase Details',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10],
        },
        {
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                { text: 'Received Amount:', bold: true, margin: [0, 5, 0, 5] },
                {
                  text: `INR ${data.receiveAmount || 0}`,
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
          layout: {
            hLineColor: () => '#4e50d3',
            vLineColor: () => '#4e50d3',
          },
          margin: [0, 0, 0, 20],
        },

        // Description Section
        {
          text: 'Payment Description',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10],
        },
        {
          text: data.description || 'No Description Provided',
          margin: [0, 0, 0, 10],
          italics: true,
        },

        // Footer Section
        {
          text: 'Thank you for your Purchase!',
          alignment: 'center',
          margin: [0, 30, 0, 0],
          fontSize: 14,
          bold: true,
          color: '#4e50d3',
        },
        {
          text: 'For any queries, please contact us at support@pec-trading.com',
          alignment: 'center',
          fontSize: 10,
          margin: [0, 5, 0, 0],
        },
      ],
      styles: {
        sectionHeader: {
          fontSize: 16,
          bold: true,
          color: '#4e50d3',
          margin: [0, 10, 0, 5],
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
