import { Component, Inject } from '@angular/core';
import { CustomerService } from '../../../../services/Customer.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-customer',
  standalone: true,
  imports: [MatDialogModule, MatSnackBarModule],
  templateUrl: './delete-customer.component.html',
  styleUrl: './delete-customer.component.css'
})
export class DeleteCustomerComponent {

  constructor(private CustomerService: CustomerService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteCustomerComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteCustomer(): void {
    this.CustomerService.DeleteCustomer(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Customer deleted successfully:', response);
        this.openSnackBar('Delete Succesfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting customer:', error);
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

