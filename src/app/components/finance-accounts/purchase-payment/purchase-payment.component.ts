import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ExcelService } from '../../../services/excel.service';
import { AddEditPurchasePaymentComponent } from './add-edit-purchase-payment/add-edit-purchase-payment.component';
import { DeletePurchasePaymentComponent } from './delete-purchase-payment/delete-purchase-payment.component';
import { PurchasePaymentsService } from '../../../services/PurchasePayment.service';

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
  displayedColumns: string[] = ['index', 'payment_id', 'vendor_name', 'amount', 'pendingAmount', 'receiveAmount', 'payment_mode', 'payment_date', 'payment_status', 'created_at', 'actions'];
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}
