import { Component, Inject } from '@angular/core';
import { QuotationService } from '../../../../services/quotation.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-quatation',
  standalone: true,
  imports: [MatDialogModule, MatSnackBarModule],
  templateUrl: './delete-quatation.component.html',
  styleUrl: './delete-quatation.component.css'
})
export class DeleteQuatationComponent {
  constructor(private QuotationService: QuotationService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteQuatationComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteQuotation(): void {
    this.QuotationService.deleteQuotation(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('quotation deleted successfully:', response);
        this.openSnackBar('Delete Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting quotation:', error);
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
