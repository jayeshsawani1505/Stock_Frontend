import { Component, Inject } from '@angular/core';
import { CreditNotesService } from '../../../../../services/CreditNote.serivce';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-credit-notes',
  standalone: true,
  imports: [],
  templateUrl: './delete-credit-notes.component.html',
  styleUrl: './delete-credit-notes.component.css'
})
export class DeleteCreditNotesComponent {
  constructor(private CreditNotesService: CreditNotesService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteCreditNotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteCreditNotes(): void {
    this.CreditNotesService.removeCreditNote(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('CreditNotes deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting CreditNotes:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
