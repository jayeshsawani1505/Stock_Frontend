import { Component, Inject } from '@angular/core';
import { InvoiceService } from '../../../../services/invoice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-invoice',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-invoice.component.html',
  styleUrl: './delete-invoice.component.css'
})
export class DeleteInvoiceComponent {
  constructor(private InvoiceService: InvoiceService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteInvoice(): void {
    this.InvoiceService.DeleteInvoice(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Invoice deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting Invoice:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
