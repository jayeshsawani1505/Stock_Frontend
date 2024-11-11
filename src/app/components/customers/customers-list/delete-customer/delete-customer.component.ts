import { Component, Inject } from '@angular/core';
import { CustomerService } from '../../../../services/Customer.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-customer',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-customer.component.html',
  styleUrl: './delete-customer.component.css'
})
export class DeleteCustomerComponent {

  constructor(private CustomerService: CustomerService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteCustomer(): void {
    this.CustomerService.DeleteCustomer(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Customer deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting customer:', error);
      }
    });
  }
  onClose(): void {
    this.dialogRef.close();
  }
}

