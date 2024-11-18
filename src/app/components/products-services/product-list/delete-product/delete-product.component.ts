import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../../services/products.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [MatDialogModule, MatSnackBarModule],
  templateUrl: './delete-product.component.html',
  styleUrl: './delete-product.component.css'
})
export class DeleteProductComponent {
  constructor(private ProductService: ProductService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteProductComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteProduct(): void {
    this.ProductService.DeleteProduct(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Product deleted successfully:', response);
        this.openSnackBar('Delete Suceessufully', 'Close');
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
