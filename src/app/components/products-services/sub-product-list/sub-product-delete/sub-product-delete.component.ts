import { Component, Inject } from '@angular/core';
import { SubProductService } from '../../../../services/subProduct.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sub-product-delete',
  standalone: true,
  imports: [MatDialogModule, MatSnackBarModule],
  templateUrl: './sub-product-delete.component.html',
  styleUrl: './sub-product-delete.component.css'
})
export class SubProductDeleteComponent {
  constructor(private SubProductService: SubProductService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<SubProductDeleteComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteProduct(): void {
    this.SubProductService.DeleteSubProduct(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Product deleted successfully:', response);
        this.openSnackBar('Delete Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting Product:', error);
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
