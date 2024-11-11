import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../../services/products.service';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-product.component.html',
  styleUrl: './delete-product.component.css'
})
export class DeleteProductComponent {
  constructor(private ProductService: ProductService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteProduct(): void {
    this.ProductService.DeleteProduct(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Product deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting Product:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
