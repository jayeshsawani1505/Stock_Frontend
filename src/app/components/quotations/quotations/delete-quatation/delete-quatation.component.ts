import { Component, Inject } from '@angular/core';
import { QuotationService } from '../../../../services/quotation.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-quatation',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-quatation.component.html',
  styleUrl: './delete-quatation.component.css'
})
export class DeleteQuatationComponent {
  constructor(private QuotationService: QuotationService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteQuatationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteQuotation(): void {
    this.QuotationService.deleteQuotation(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('quotation deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting quotation:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
