import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { VendorService } from '../../../../services/vendors.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-vendor',
  standalone: true,
  imports: [MatDialogModule, MatSnackBarModule],
  templateUrl: './delete-vendor.component.html',
  styleUrl: './delete-vendor.component.css'
})
export class DeleteVendorComponent {

  constructor(private VendorService: VendorService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteVendorComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteVendor(): void {
    this.VendorService.DeleteVendor(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Vendor deleted successfully:', response);
        this.openSnackBar('Delete Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting Vendor:', error);
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
