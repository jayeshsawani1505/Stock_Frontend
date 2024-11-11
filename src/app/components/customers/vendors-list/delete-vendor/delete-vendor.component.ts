import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { VendorService } from '../../../../services/vendors.service';

@Component({
  selector: 'app-delete-vendor',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-vendor.component.html',
  styleUrl: './delete-vendor.component.css'
})
export class DeleteVendorComponent {

  constructor(private VendorService: VendorService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteVendorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteVendor(): void {
    this.VendorService.DeleteVendor(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Vendor deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting Vendor:', error);
      }
    });
  }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
