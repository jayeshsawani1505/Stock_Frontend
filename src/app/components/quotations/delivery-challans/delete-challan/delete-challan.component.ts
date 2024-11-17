import { Component, Inject } from '@angular/core';
import { QuotationService } from '../../../../services/quotation.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-challan',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-challan.component.html',
  styleUrl: './delete-challan.component.css'
})
export class DeleteChallanComponent {
  constructor(private QuotationService: QuotationService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteChallanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteDeliveryChallan(): void {
    this.QuotationService.deleteDeliveryChallan(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Challan deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting Challan:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
