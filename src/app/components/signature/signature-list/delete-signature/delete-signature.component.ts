import { Component, Inject } from '@angular/core';
import { SignatureService } from '../../../../services/signature.srvice';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-signature',
  standalone: true,
  imports: [MatSnackBarModule],
  templateUrl: './delete-signature.component.html',
  styleUrl: './delete-signature.component.css'
})
export class DeleteSignatureComponent {
  constructor(private SignatureService: SignatureService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteSignatureComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  DeleteSignature(): void {
    this.SignatureService.DeleteSignature(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Category deleted successfully:', response);
        this.openSnackBar('Delete Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting Category:', error);
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
