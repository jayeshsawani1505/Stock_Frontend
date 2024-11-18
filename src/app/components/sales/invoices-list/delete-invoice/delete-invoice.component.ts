import { Component, Inject } from '@angular/core';
import { InvoiceService } from '../../../../services/invoice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-invoice',
  standalone: true,
  imports: [MatDialogModule, MatSnackBarModule],
  templateUrl: './delete-invoice.component.html',
  styleUrl: './delete-invoice.component.css'
})
export class DeleteInvoiceComponent {
  constructor(private InvoiceService: InvoiceService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteInvoiceComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteInvoice(): void {
    this.InvoiceService.DeleteInvoice(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Invoice deleted successfully:', response);
        this.openSnackBar('Delete Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting Invoice:', error);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}
