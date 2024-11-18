import { Component, Inject } from '@angular/core';
import { QuotationService } from '../../../../services/quotation.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-challan',
  standalone: true,
  imports: [MatDialogModule, MatSnackBarModule],
  templateUrl: './delete-challan.component.html',
  styleUrl: './delete-challan.component.css'
})
export class DeleteChallanComponent {
  constructor(private QuotationService: QuotationService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteChallanComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteDeliveryChallan(): void {
    this.QuotationService.deleteDeliveryChallan(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Challan deleted successfully:', response);
        this.openSnackBar('Deleted Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting Challan:', error);
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
