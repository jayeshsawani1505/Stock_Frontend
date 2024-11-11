import { Component, Inject } from '@angular/core';
import { ReturnDebitNotesPurchaseService } from '../../../../services/return-debit-notes-purchases.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-debit',
  standalone: true,
  imports: [],
  templateUrl: './delete-debit.component.html',
  styleUrl: './delete-debit.component.css'
})
export class DeleteDebitComponent {
  constructor(private DebitService: ReturnDebitNotesPurchaseService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteDebitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteDebit(): void {
    this.DebitService.deleteReturnDebitNotePurchase(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Debit deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting Debit:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
