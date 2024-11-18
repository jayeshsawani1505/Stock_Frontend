import { Component, Inject } from '@angular/core';
import { PurchaseService } from '../../../../services/purchases.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-purchases',
  standalone: true,
  imports: [MatDialogModule, MatSnackBarModule],
  templateUrl: './delete-purchases.component.html',
  styleUrl: './delete-purchases.component.css'
})
export class DeletePurchasesComponent {
  constructor(private PurchasesService: PurchaseService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeletePurchasesComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deletePurchases(): void {
    this.PurchasesService.deletePurchase(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Purchases deleted successfully:', response);
        this.openSnackBar('Delete Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting Purchases:', error);
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
