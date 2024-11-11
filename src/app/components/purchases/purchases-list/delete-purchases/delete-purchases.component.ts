import { Component, Inject } from '@angular/core';
import { PurchaseService } from '../../../../services/purchases.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-purchases',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-purchases.component.html',
  styleUrl: './delete-purchases.component.css'
})
export class DeletePurchasesComponent {
  constructor(private PurchasesService: PurchaseService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeletePurchasesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deletePurchases(): void {
    this.PurchasesService.deletePurchase(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Purchases deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting Purchases:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
