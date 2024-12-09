import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { CustomerService } from '../../../../services/Customer.service';
import { PaymentService } from '../../../../services/payments.service';

@Component({
  selector: 'app-add-edit-payment',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule,
    MatDialogModule, MatSnackBarModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './add-edit-payment.component.html',
  styleUrl: './add-edit-payment.component.css'
})
export class AddEditPaymentComponent implements OnInit {
  paymentForm: FormGroup;
  customerList: any[] = [];
  customerControl = new FormControl('');
  filteredCustomers!: Observable<any[]>;

  constructor(private fb: FormBuilder,
    private PaymentService: PaymentService,
    private CustomerService: CustomerService,
    public dialogRef: MatDialogRef<AddEditPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
  ) {
    console.log(data);

    this.paymentForm = this.fb.group({
      payment_id: [''], // For edit scenarios
      customer_id: ['', Validators.required],
      total_amount: [''],
      receiveAmount: ['', [Validators.required, Validators.min(0)]],
      pendingAmount: ['', [Validators.required, Validators.min(0)]],
      payment_mode: ['', Validators.required],
      payment_date: ['', Validators.required],
      payment_status: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.GetCustomers();
    if (this.data?.payment_id) {
      this.fetchData(this.data)
    }
    // Initialize filteredCustomers based on customerControl input changes
    this.filteredCustomers = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomers(value))
    );
  }

  GetCustomers() {
    this.CustomerService.GetCustomers().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.customers) {
          this.customerList = res.customers;
          if (this.data?.payment_id) {
            const selectedData = this.customerList.find(data => data.customer_id === this.data?.customer_id);
            if (selectedData) {
              this.customerControl.setValue(`${selectedData.name}`);
              this.paymentForm.get('customer_id')?.setValue(selectedData.customer_id); // Set the invoice_id
              this.paymentForm.get('total_amount')?.setValue(selectedData?.opening_balance)
            }
          }
        }
      },
      error: (err) => {
        this.snackBar.open('Failed to fetch customer', 'Close', { duration: 3000 });
      }
    });
  }

  // Filter the customers based on the search input
  private _filterCustomers(value: string | null): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.customerList.filter(invoice =>
      `${invoice.name}`.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any): void {
    const selectedInvoice = event.option.value; // This will give the full invoice object
    console.log(selectedInvoice);
    this.paymentForm.get('total_amount')?.setValue(selectedInvoice?.closing_balance)
    this.paymentForm.get('customer_id')?.setValue(selectedInvoice.customer_id); // Set the customer_id to the selected invoice's id
    this.customerControl.setValue(selectedInvoice.name); // Update the customer name field
  }
  calculateTotal() {
    const total = this.paymentForm.get('total_amount')?.value - this.paymentForm.get('receiveAmount')?.value;
    console.log(total);
    this.paymentForm.get('pendingAmount')?.setValue(total)
  }

  fetchData(payment: any) {
    const formattedDate = payment.payment_date
      ? new Date(payment.payment_date).toISOString().split('T')[0] // Format to 'YYYY-MM-DD'
      : '';
    this.paymentForm.patchValue({
      payment_id: payment.payment_id || '',
      customer_id: payment.customer_id || '',
      receiveAmount: payment.receiveAmount || '',
      pendingAmount: payment.pendingAmount || '',
      payment_mode: payment.payment_mode || '',
      payment_date: formattedDate || '',
      payment_status: payment.payment_status || '',
      description: payment.description || '',
    });
  }

  addPayment(): void {
    console.log(this.paymentForm.value);

    if (this.paymentForm.invalid) {
      console.warn('Payment form is invalid. Please check the form fields.');
      return;
    }

    const paymentData = this.paymentForm.value;

    this.PaymentService.AddPayment(paymentData).subscribe({
      next: (response) => {
        console.log('Payment added successfully:', response);
        this.onClose();
        this.openSnackBar('Added Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error adding payment:', error);
        this.openSnackBar('error', 'Close');
      },
    });
  }

  editPayment(): void {
    if (this.paymentForm.invalid) {
      console.warn('Payment form is invalid. Please check the form fields.');
      return;
    }

    const paymentData = this.paymentForm.value;

    this.PaymentService.UpdatePayment(this.data?.payment_id, paymentData).subscribe({
      next: (response) => {
        console.log('Payment Update successfully:', response);
        this.onClose();
        this.openSnackBar('Update Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error adding payment:', error);
        this.openSnackBar('error', 'Close');
      },
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