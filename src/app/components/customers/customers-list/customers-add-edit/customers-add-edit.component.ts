import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../services/Customer.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-customers-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './customers-add-edit.component.html',
  styleUrl: './customers-add-edit.component.css'
})
export class CustomersAddEditComponent implements OnInit {
  customerForm: FormGroup;
  customerData: any;
  imageUrl: string | ArrayBuffer | null = null;
  fileName: string = '';
  selectedFile: File | null = null;
  isAddMode: boolean = true;
  imgURL = environment.ImageUrl

  constructor(private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
  ) {
    this.customerForm = this.fb.group({
      profile_photo: [],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      currency: ['', Validators.required],
      website: [''],
      notes: [''],

      billing_name: ['', Validators.required],
      billing_address_line1: ['', Validators.required],
      billing_address_line2: [''],
      billing_country: ['', Validators.required],
      billing_state: [''],
      billing_city: ['', Validators.required],
      billing_pincode: [''],

      shipping_name: [''],
      shipping_address_line1: [''],
      shipping_address_line2: [''],
      shipping_country: [''],
      shipping_state: [''],
      shipping_city: [''],
      shipping_pincode: [''],

      bank_name: [''],
      branch: [''],
      account_holder_name: [''],
      account_number: [''],
      ifsc: ['']
    });
  }

  ngOnInit(): void {
    this.fetchCustomerData();
  }

  // Method to fetch customer data, either from route state or API
  fetchCustomerData() {
    // Get customer data from history state (if available)
    this.customerData = history.state.customerData;

    if (this.customerData) {
      this.isAddMode = false;
      // Populate the form with the customer data
      this.populateForm(this.customerData);
    }
  }
  // If fetching from the state is successful, populate the form
  populateForm(customer: any) {
    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      currency: customer.currency,
      website: customer.website,
      notes: customer.notes,
      billing_name: customer.billing_name,
      billing_address_line1: customer.billing_address_line1,
      billing_address_line2: customer.billing_address_line2,
      billing_country: customer.billing_country,
      billing_state: customer.billing_state,
      billing_city: customer.billing_city,
      billing_pincode: customer.billing_pincode,
      shipping_name: customer.shipping_name,
      shipping_address_line1: customer.shipping_address_line1,
      shipping_address_line2: customer.shipping_address_line2,
      shipping_country: customer.shipping_country,
      shipping_state: customer.shipping_state,
      shipping_city: customer.shipping_city,
      shipping_pincode: customer.shipping_pincode,
      bank_name: customer.bank_name,
      branch: customer.branch,
      account_holder_name: customer.account_holder_name,
      account_number: customer.account_number,
      ifsc: customer.ifsc,
      profile_photo: customer.profile_photo
    });
    this.imageUrl = this.imgURL + customer.profile_photo,
      this.selectedFile = customer.profile_photo
  }

  // Utility function to copy billing address to shipping address
  copyBillingToShipping(): void {
    const billing = this.customerForm.value;
    this.customerForm.patchValue({
      shipping_name: billing.billing_name,
      shipping_address_line1: billing.billing_address_line1,
      shipping_address_line2: billing.billing_address_line2,
      shipping_country: billing.billing_country,
      shipping_state: billing.billing_state,
      shipping_city: billing.billing_city,
      shipping_pincode: billing.billing_pincode
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.isFileSizeValid(file)) {
        this.previewFile(file);
      } else {
        this.removeImage();
      }
    }
  }

  private isFileSizeValid(file: File): boolean {
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert 2 MB to bytes
    const isValid = file.size <= maxSizeInBytes;

    if (!isValid) {
      alert('File size exceeds 2 MB. Please select a smaller file.');
    }

    return isValid;
  }

  private previewFile(file: File): void {
    this.fileName = file.name;
    this.selectedFile = file;

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imageUrl = null;
    this.fileName = '';
    this.selectedFile = null;
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      // Check if history state has customer data for update
      const customerData = history.state.customerData;

      if (customerData) {
        // If customer data exists in state, update the customer
        this.updateCustomer(customerData.customer_id, this.customerForm.value);
      } else {
        // Otherwise, add a new customer
        this.addCustomer(this.customerForm.value);
      }
    }
  }

  addCustomer(customerData: any) {
    this.customerService.AddCustomer(customerData, this.selectedFile || undefined).subscribe({
      next: (response) => {
        console.log('Customer added successfully:', response);
        this.router.navigate(['/admin/customers/customers-list']);
      },
      error: (error) => {
        console.error('Error adding customer:', error);
      }
    });
  }

  updateCustomer(customerId: number, updatedData: any) {
    this.customerService.UpdateCustomer(customerId, updatedData, this.selectedFile || undefined).subscribe({
      next: (response) => {
        console.log('Customer updated successfully:', response);
        this.router.navigate(['/admin/customers/customers-list']);
      },
      error: (error) => {
        console.error('Error updating customer:', error);
      }
    });
  }
}