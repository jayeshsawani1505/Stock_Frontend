import { Component, Inject } from '@angular/core';
import { SubProductService } from '../../../../services/subProduct.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sub-product-delete',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './sub-product-delete.component.html',
  styleUrl: './sub-product-delete.component.css'
})
export class SubProductDeleteComponent {
  constructor(private SubProductService: SubProductService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<SubProductDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteProduct(): void {
    this.SubProductService.DeleteSubProduct(this.data).subscribe({
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
