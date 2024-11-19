import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentService } from '../../../../services/payments.service';

@Component({
  selector: 'app-delete-payment',
  standalone: true,
  imports: [MatSnackBarModule],
  templateUrl: './delete-payment.component.html',
  styleUrl: './delete-payment.component.css'
})
export class DeletePaymentComponent {
  constructor(private PaymentService: PaymentService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeletePaymentComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  DeletePayment(): void {
    this.PaymentService.DeletePayment(this.data).subscribe({
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

