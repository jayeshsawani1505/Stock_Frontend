import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { PurchasePaymentsService } from '../../../../services/PurchasePayment.service';
import { VendorService } from '../../../../services/vendors.service';

@Component({
  selector: 'app-add-edit-purchase-payment',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule,
    MatDialogModule, MatSnackBarModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './add-edit-purchase-payment.component.html',
  styleUrl: './add-edit-purchase-payment.component.css'
})
export class AddEditPurchasePaymentComponent implements OnInit {
  paymentForm: FormGroup;
  vendorList: any[] = [];
  vendorControl = new FormControl();
  filteredVendors!: Observable<any[]>;

  constructor(private fb: FormBuilder,
    private VendorService: VendorService,
    private PurchasePaymentsService: PurchasePaymentsService,
    public dialogRef: MatDialogRef<AddEditPurchasePaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
  ) {
    console.log(data);

    this.paymentForm = this.fb.group({
      payment_id: [''], // For edit scenarios
      vendor_id: ['', Validators.required],
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
    this.GetVendors();
    if (this.data?.payment_id) {
      this.fetchData(this.data)
    }
    // Initialize filteredCustomers based on customerControl input changes
    this.filteredVendors = this.vendorControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this._filterVendors(value))
    );
  }

  GetVendors(): void {
    this.VendorService.GetVendors().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.vendors) {
          this.vendorList = res.vendors;
          const selectedInvoice = this.vendorList.find(data => data.vendor_id === this.data?.vendor_id);
          if (selectedInvoice) {
            this.vendorControl.setValue(`${selectedInvoice.vendor_name} (${selectedInvoice.supplier_invoice_serial_no})`);
            this.paymentForm.get('vendor_id')?.setValue(selectedInvoice.vendor_id); // Set the vendor_id
            this.paymentForm.get('total_amount')?.setValue(selectedInvoice?.total_amount)
          }
        }
      },
      error: (err) => {
        console.error('Error fetching Purchases:', err);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  // Filter the customers based on the search input
  private _filterVendors(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.vendorList.filter(vendor =>
      vendor.vendor_name.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any): void {
    const selectedInvoice = event.option.value; // This will give the full invoice object
    console.log(selectedInvoice);
    this.paymentForm.get('total_amount')?.setValue(selectedInvoice?.closing_balance)
    this.paymentForm.get('vendor_id')?.setValue(selectedInvoice.vendor_id); // Set the vendor_id to the selected invoice's id
    this.vendorControl.setValue(selectedInvoice.vendor_name); // Update the customer name field
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
      vendor_id: payment.vendor_id || '',
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

    this.PurchasePaymentsService.addPurchasePayment(paymentData).subscribe({
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

    this.PurchasePaymentsService.updatePurchasePayment(this.data?.payment_id, paymentData).subscribe({
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