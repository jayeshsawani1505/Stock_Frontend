import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../services/Customer.service';

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

  constructor(private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
  ) {
    this.customerForm = this.fb.group({
      // profile_photo: ['https://example.com/profile.jpg'],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      currency: ['USD', Validators.required],
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
      ifsc: customer.ifsc
    });
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
    this.customerService.AddCustomer(customerData).subscribe({
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
    this.customerService.UpdateCustomer(customerId, updatedData).subscribe({
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