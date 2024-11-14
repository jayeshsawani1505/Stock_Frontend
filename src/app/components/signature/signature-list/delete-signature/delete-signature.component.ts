import { Component, Inject } from '@angular/core';
import { SignatureService } from '../../../../services/signature.srvice';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-signature',
  standalone: true,
  imports: [],
  templateUrl: './delete-signature.component.html',
  styleUrl: './delete-signature.component.css'
})
export class DeleteSignatureComponent {
  constructor(private SignatureService: SignatureService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteSignatureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  DeleteSignature(): void {
    this.SignatureService.DeleteSignature(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Category deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting Category:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
