import { Component, Inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PurchasePaymentsService } from '../../../../services/PurchasePayment.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-purchase-payment',
  standalone: true,
  imports: [MatSnackBarModule],
  templateUrl: './delete-purchase-payment.component.html',
  styleUrl: './delete-purchase-payment.component.css'
})
export class DeletePurchasePaymentComponent {
  constructor(private PurchasePaymentsService: PurchasePaymentsService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeletePurchasePaymentComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deletePurchasePayment(): void {
    this.PurchasePaymentsService.deletePurchasePayment(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Payment deleted successfully:', response);
        this.openSnackBar('Delete Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting Payment:', error);
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