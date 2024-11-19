import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CreditNotesService } from '../../../../services/CreditNote.serivce';

@Component({
  selector: 'app-delete-credit-notes',
  standalone: true,
  imports: [MatSnackBarModule],
  templateUrl: './delete-credit-notes.component.html',
  styleUrl: './delete-credit-notes.component.css'
})
export class DeleteCreditNotesComponent {
  constructor(private CreditNotesService: CreditNotesService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteCreditNotesComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteCreditNotes(): void {
    this.CreditNotesService.removeCreditNote(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('CreditNotes deleted successfully:', response);
        this.openSnackBar('DElete Succesfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting CreditNotes:', error);
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
