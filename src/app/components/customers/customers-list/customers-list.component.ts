import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../services/company.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [CustomerService],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.css'
})
export class CustomersListComponent implements OnInit {
  customerList: any[] = []; // Define customerList to store customer data
  customerIdToDelete: number | null = null;

  constructor(private CustomerService: CustomerService, private router: Router) { }

  ngOnInit(): void {
    this.GetCustomers();
  }

  // GetCustomers method
  GetCustomers() {
    this.CustomerService.GetCustomers().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.customers) {
          this.customerList = res.customers; // Assign customers data to customerList
        }
      },
      error: (err: any) => {
        console.error('Error fetching customers:', err);
      }
    });
  }

  editCustomer(customer: any) {
    this.router.navigate(['/admin/customers/customers-edit', customer.customer_id], {
      state: { customerData: customer } // Pass customer data as state
    });
  }

  // Store the customer ID to be deleted
  openDeleteConfirmation(customerId: number): void {
    this.customerIdToDelete = customerId;

    // Show confirmation alert
    const confirmation = window.confirm('Are you sure you want to delete this customer?');

    if (confirmation && this.customerIdToDelete !== null) {
      this.deleteCustomer();
    }
  }

  // Call the delete API when deletion is confirmed
  deleteCustomer(): void {
    if (this.customerIdToDelete !== null) {
      this.CustomerService.DeleteCustomer(this.customerIdToDelete).subscribe({
        next: (response) => {
          this.GetCustomers();
          console.log('Customer deleted successfully:', response);
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
        }
      });
    }
  }

}