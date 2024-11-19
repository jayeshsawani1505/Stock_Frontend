import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { DeleteCreditNotesComponent } from './delete-credit-notes/delete-credit-notes.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExcelService } from '../../../services/excel.service';
import { CreditNotesService } from '../../../services/CreditNote.serivce';

@Component({
  selector: 'app-credit-notes',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule, MatSnackBarModule
  ],
  templateUrl: './credit-notes.component.html',
  styleUrl: './credit-notes.component.css'
})
export class CreditNotesComponent implements OnInit, AfterViewInit {
  creditNoteList: any[] = []; // Define creditNoteList to store credit note data
  creditNoteIdToDelete: number | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['id', 'reference_number', 'quantity', 'rate', 'total_amount', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private creditNotesService: CreditNotesService,
    private ExcelService: ExcelService, public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.getCreditNotes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  // Fetch credit notes
  getCreditNotes(): void {
    this.creditNotesService.fetchCreditNotes().subscribe({
      next: (res: any) => {
        if (res && res.invoices) {
          console.log(res);
          this.creditNoteList = res.invoices;
          this.dataSource.data = this.creditNoteList;
        }
      },
      error: (err) => {
        console.error('Error fetching credit notes:', err);
        this.openSnackBar('error', 'Close');
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

  // Handle file selection for uploading credit notes
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.creditNotesService.uploadCreditNoteExcel(file).subscribe(
        response => {
          this.getCreditNotes();
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

  // Navigate to the credit note edit page
  editCreditNote(creditNote: any): void {
    this.router.navigate(['/admin/sales/credit-notes-edit', creditNote.id], {
      state: { creditNoteData: creditNote } // Pass credit note data as state
    });
  }

  // Methods for handling actions
  downloadCreditNotePdf(creditNoteId: number) {
    console.log('Download PDF for Credit Note ID:', creditNoteId);
  }

  viewCreditNoteDetails(note: any) {
    console.log('Viewing details for:', note);
  }

  sendCreditNoteEmail(creditNoteId: number) {
    console.log('Sending Credit Note ID:', creditNoteId);
  }

  openDeleteConfirmation(creditNoteId: number) {
    const dialogRef = this.dialog.open(DeleteCreditNotesComponent, {
      data: creditNoteId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getCreditNotes();
    });
  }
  excelDownload(title: string) {
    // Assuming creditNoteList contains the list of credit notes
    let dataToExport = this.creditNoteList.map((x: any) => ({
      id: x.id,
      customer_id: x.customer_id,
      creditNote_date: x.creditNote_date,
      due_date: x.due_date,
      reference_number: x.reference_number,
      product_id: x.product_id,
      quantity: x.quantity,
      unit: x.unit,
      rate: x.rate,
      notes: x.notes,
      terms_conditions: x.terms_conditions,
      total_amount: x.total_amount,
      signature_image: x.signature_image,
      created_at: x.created_at,
      updated_at: x.updated_at,
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