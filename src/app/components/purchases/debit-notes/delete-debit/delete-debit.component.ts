import { Component, Inject } from '@angular/core';
import { ReturnDebitNotesPurchaseService } from '../../../../services/return-debit-notes-purchases.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-debit',
  standalone: true,
  imports: [MatSnackBarModule],
  templateUrl: './delete-debit.component.html',
  styleUrl: './delete-debit.component.css'
})
export class DeleteDebitComponent {
  constructor(private DebitService: ReturnDebitNotesPurchaseService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteDebitComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteDebit(): void {
    this.DebitService.deleteReturnDebitNotePurchase(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Debit deleted successfully:', response);
        this.openSnackBar('Delete Suceessfully', 'Close');

      },
      error: (error) => {
        console.error('Error deleting Debit:', error);
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
