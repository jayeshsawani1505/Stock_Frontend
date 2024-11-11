import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { VendorService } from '../../../../services/vendors.service';

@Component({
  selector: 'app-vendors-add-edit',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule],
  providers: [VendorService],
  templateUrl: './vendors-add-edit.component.html',
  styleUrl: './vendors-add-edit.component.css'
})
export class VendorsAddEditComponent implements OnInit {
  vendorForm: FormGroup;

  constructor(
    private vendorService: VendorService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VendorsAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.vendorForm = this.fb.group({
      vendor_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      closing_balance: ['', Validators.required],
      vendor_id: ['']
    });
  }

  ngOnInit(): void {
    if (this.data?.vendor_id) {
      this.fetchVendorData(this.data);
    }
  }

  // Fetch existing vendor data and populate the form
  fetchVendorData(vendor: any): void {
    this.vendorForm.patchValue({
      vendor_id: vendor.vendor_id,
      vendor_name: vendor.vendor_name,
      email: vendor.email,
      phone_number: vendor.phone_number,
      closing_balance: vendor.closing_balance
    });
  }

  // Add or edit vendor based on whether vendor_id exists
  onSubmit(): void {
    if (this.vendorForm.invalid) {
      return;
    }

    if (this.vendorForm.value.vendor_id) {
      this.updateVendor();
    } else {
      this.addVendor();
    }
  }

  // Add a new vendor
  addVendor(): void {
    const vendorData = this.vendorForm.value;
    this.vendorService.AddVendor(vendorData).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Vendor added successfully:', response);
      },
      error: (error) => {
        console.error('Error adding vendor:', error);
      }
    });
  }

  // Update an existing vendor
  updateVendor(): void {
    const vendorData = this.vendorForm.value;
    this.vendorService.UpdateVendor(vendorData.vendor_id, vendorData).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Vendor updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating vendor:', error);
      }
    });
  }

  // Close the dialog
  onClose(): void {
    this.dialogRef.close();
  }
}
