import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/products.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InvoiceService } from '../../../../services/invoice.service';

@Component({
  selector: 'app-change-invoice-status',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule,
    FormsModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './change-invoice-status.component.html',
  styleUrl: './change-invoice-status.component.css'
})
export class ChangeInvoiceStatusComponent {
  stockForm: FormGroup;
  statusData: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeInvoiceStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private InvoiceService: InvoiceService,
    private snackBar: MatSnackBar
  ) {
    console.log(data);

    this.statusData = data;

    // Initialize form with data, if any
    this.stockForm = this.fb.group({
      invoice_number: [this.statusData?.invoice_number || '', Validators.required],
      status: [this.statusData?.status || '', [Validators.required,]],
    });
  }

  onSubmit() {
    const status = this.stockForm.value.status;

    this.InvoiceService.ChangeInvoiceStatus(this.statusData.id, { status }).subscribe({
      next: (response) => {
        this.onCancel();
        console.log('Status changed successfully:', response);
        this.openSnackBar('Status Changed Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error changing invoice status:', error);
        this.openSnackBar('Error changing status', 'Close');
      }
    });
  }

  onCancel(): void {
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
