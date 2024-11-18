import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { ExcelService } from '../../../services/excel.service';
import { ReturnDebitNotesPurchaseService } from '../../../services/return-debit-notes-purchases.service';
import { DeleteDebitComponent } from './delete-debit/delete-debit.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-debit-notes',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule, MatSnackBarModule
  ],
  templateUrl: './debit-notes.component.html',
  styleUrl: './debit-notes.component.css'
})
export class DebitNotesComponent implements OnInit, AfterViewInit {
  PurchaseList: any[] = []; // Define PurchaseList to store Purchase data
  PurchaseIdToDelete: number | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['vendor_id', 'vendor_name', 'total_amount', 'payment_mode', 'status', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private ReturnDebitNotesPurchaseService: ReturnDebitNotesPurchaseService,
    private ExcelService: ExcelService, public dialog: MatDialog, private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.getReturnDebitNotesPurchases();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  // getReturnDebitNotesPurchases method
  getReturnDebitNotesPurchases() {
    this.ReturnDebitNotesPurchaseService.getReturnDebitNotesPurchases().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.PurchaseList = res.data; // Assign Purchases data to PurchaseList
          this.dataSource.data = this.PurchaseList;
        }
      },
      error: (err: any) => {
        console.error('Error fetching Purchases:', err);
      }
    });
  }

  // Apply filter based on search input
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Check if input and input.files are not null
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.ReturnDebitNotesPurchaseService.uploadExcel(file).subscribe(
        response => {
          this.getReturnDebitNotesPurchases();
          console.log('File uploaded successfully', response);
          this.openSnackBar('Uploaded Successfully', 'Close');
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


  editPurchase(Purchase: any) {
    this.router.navigate(['/admin/purchases/debit-notes-edit/', Purchase.id], {
      state: { PurchaseData: Purchase } // Pass Purchase data as state
    });
  }

  // Store the Purchase ID to be deleted
  openDeleteConfirmation(PurchaseId: number): void {
    const dialogRef = this.dialog.open(DeleteDebitComponent, {
      data: PurchaseId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getReturnDebitNotesPurchases();
    });
  }

  excelDownload(title: string) {
    // Assuming purchaseList contains the list of purchase records
    let dataToExport = this.PurchaseList.map((x: any) => ({
      vendor_id: x.vendor_id,
      purchase_date: x.purchase_date,
      due_date: x.due_date,
      reference_no: x.reference_no,
      supplier_invoice_serial_no: x.supplier_invoice_serial_no,
      product_id: x.product_id,
      quantity: x.quantity,
      unit: x.unit,
      rate: x.rate,
      notes: x.notes,
      terms_conditions: x.terms_conditions,
      total_amount: x.total_amount,
      signature_image: x.signature_image,
      created_at: x.created_at,
      payment_mode: x.payment_mode,
      status: x.status,
      vendor_name: x.vendor_name
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