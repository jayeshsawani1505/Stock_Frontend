import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../services/Customer.service';
import { InvoiceService } from '../../../../services/invoice.service';
import { ProductService } from '../../../../services/products.service';
import { SubProductService } from '../../../../services/subProduct.service';

@Component({
  selector: 'app-invoices-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './invoices-add-edit.component.html',
  styleUrl: './invoices-add-edit.component.css'
})
export class InvoicesAddEditComponent implements OnInit {
  invoiceForm!: FormGroup;
  customerList: any[] = []; // Define customerList to store customer data
  productList: any[] = []; // Define productList to store product dataX
  subProductList: any[] = []; // Define subProductList to store product dataX
  invoiceData: any;
  product_name: any;

  constructor(private fb: FormBuilder,
    private CustomerService: CustomerService,
    private productService: ProductService,
    private SubProductService: SubProductService,
    private invoiceService: InvoiceService,
    private router: Router
  ) {
    this.invoiceForm = this.fb.group({
      invoice_number: ['', Validators.required],
      customer_id: ['', Validators.required],
      invoice_date: ['', Validators.required],
      due_date: ['', Validators.required],
      reference_number: ['', Validators.required],
      status: ['Pending', Validators.required],
      // recurring: [0, Validators.required],
      recurring_cycle: [''],
      product_id: ['', Validators.required],
      subproduct_id: [0, Validators.required],
      quantity: ['', Validators.required],
      // unit: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0)]],
      notes: ['', Validators.required],
      terms_conditions: ['', Validators.required],
      total_amount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.GetCustomers();
    this.GetProducts();
    this.fetchinvoiceData();
  }


  GetCustomers() {
    this.CustomerService.GetCustomers().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.customers) {
          this.customerList = res.customers; // Assign customers data to customerList
        }
      },
    });
  }

  // GetProducts method
  GetProducts() {
    this.productService.GetProducts().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.products) {
          this.productList = res.products; // Assign products data to productList
        }
      }
    });
  }

  GetSubProductsByProductId(productId: any) {
    this.SubProductService.GetSubProductsByProductId(productId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.subProductList = res.subproducts; // Assign products data to productList
      }
    });
  }

  // Method to fetch customer data, either from route state or API
  fetchinvoiceData() {
    // Get customer data from history state (if available)
    this.invoiceData = history.state.invoiceData;

    if (this.invoiceData) {
      console.log(this.invoiceData);

      // Populate the form with the customer data
      this.populateForm(this.invoiceData);
    }
  }

  // Populate the form with the invoice data
  populateForm(invoice: any): void {
    this.GetSubProductsByProductId(invoice.product_id,)
    this.invoiceForm.patchValue({
      invoice_number: invoice.invoice_number,
      customer_id: invoice.customer_id,
      invoice_date: new Date(invoice.invoice_date),
      due_date: new Date(invoice.due_date),
      reference_number: invoice.reference_number,
      status: invoice.status,
      recurring_cycle: invoice.recurring_cycle,
      product_id: invoice.product_id,
      subproduct_id: invoice.subproduct_id,
      notes: invoice.notes,
      terms_conditions: invoice.terms_conditions,
      quantity: invoice.quantity,
      rate: invoice.rate,
      total_amount: invoice.total_amount,
    });
    const product = this.productList.find(p => p.product_id === invoice.product_id);
    this.product_name = product ? product.product_name : null;
  }

  onProductChange(event: Event): void {
    // Parse the selected product ID as an integer
    const selectedProductId = parseInt((event.target as HTMLSelectElement).value, 10);
    this.GetSubProductsByProductId(selectedProductId);
    console.log('Selected Product ID:', selectedProductId);

    // Find the selected product from the productList
    const selectedProduct = this.productList.find(product => product.product_id === selectedProductId);
    if (selectedProduct) {
      this.product_name = selectedProduct?.product_name
      console.log('Selected Product:', selectedProduct);
    }
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      // Check if history state has invoice data for update
      const invoiceData = history.state.invoiceData;

      if (invoiceData) {
        // If invoice data exists in state, update the invoice
        this.updateInvoice(invoiceData.id, this.invoiceForm.value);
      } else {
        // Otherwise, add a new invoice
        this.addInvoice(this.invoiceForm.value);
      }
    }
  }

  addInvoice(invoiceData: any) {
    this.invoiceService.AddInvoice(invoiceData).subscribe({
      next: (response) => {
        console.log('Invoice added successfully:', response);
        this.router.navigate(['/admin/sales/invoices']);  // Redirect to invoice list page after adding
      },
      error: (error) => {
        console.error('Error adding invoice:', error);
      }
    });
  }

  updateInvoice(invoiceId: number, updatedData: any) {
    this.invoiceService.UpdateInvoice(invoiceId, updatedData).subscribe({
      next: (response) => {
        console.log('Invoice updated successfully:', response);
        this.router.navigate(['/admin/sales/invoices']);  // Redirect to invoice list page after updating
      },
      error: (error) => {
        console.error('Error updating invoice:', error);
      }
    });
  }


  onReset(): void {
    this.invoiceForm.reset();
  }
}