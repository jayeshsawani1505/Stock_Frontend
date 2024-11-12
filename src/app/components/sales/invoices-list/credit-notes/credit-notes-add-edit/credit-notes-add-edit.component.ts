import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreditNotesService } from '../../../../../services/CreditNote.serivce';
import { CustomerService } from '../../../../../services/Customer.service';
import { ProductService } from '../../../../../services/products.service';
import { SubProductService } from '../../../../../services/subProduct.service';

@Component({
  selector: 'app-credit-notes-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './credit-notes-add-edit.component.html',
  styleUrl: './credit-notes-add-edit.component.css'
})
export class CreditNotesAddEditComponent implements OnInit {
  creditNoteForm!: FormGroup;
  customerList: any[] = []; // Define customerList to store customer data
  productList: any[] = []; // Define productList to store product data
  subProductList: any[] = []; // Define subProductList to store product dataX
  creditNoteData: any;
  product_name: any;
  constructor(private fb: FormBuilder,
    private CustomerService: CustomerService,
    private productService: ProductService,
    private CreditNotesService: CreditNotesService,
    private SubProductService: SubProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.creditNoteForm = this.fb.group({
      customer_id: ['', Validators.required],
      creditNote_date: ['', Validators.required],
      due_date: ['', Validators.required],
      reference_number: ['', Validators.required],
      status: ['Pending', Validators.required],
      product_id: ['', Validators.required],
      subproduct_id: [0],
      quantity: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0)]],
      notes: ['', Validators.required],
      terms_conditions: ['', Validators.required],
      total_amount: ['', [Validators.required, Validators.min(0)]]
    });

    this.GetCustomers();
    this.GetProducts();
    this.fetchcreditNoteData();
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
  fetchcreditNoteData() {
    // Retrieve credit note data from router state
    this.creditNoteData = history.state.creditNoteData;

    if (this.creditNoteData) {
      console.log('Credit Note Data:', this.creditNoteData);
      // Populate the form with the credit note data
      this.populateForm(this.creditNoteData);
    } else {
      console.warn('No credit note data available in state');
    }
  }

  // Populate the form with the invoice data
  populateForm(invoice: any): void {
    this.GetSubProductsByProductId(invoice.product_id,)
    this.creditNoteForm.patchValue({
      customer_id: invoice.customer_id,
      creditNote_date: new Date(invoice.creditNote_date), // Change invoice_date to creditNote_date
      due_date: new Date(invoice.due_date),
      reference_number: invoice.reference_number,
      status: invoice.status || 'Pending', // Set default if status is missing
      product_id: invoice.product_id,
      subproduct_id: invoice.subproduct_id,
      quantity: invoice.quantity,
      rate: invoice.rate,
      notes: invoice.notes,
      terms_conditions: invoice.terms_conditions,
      total_amount: invoice.total_amount,
    });

    const product = this.productList.find(p => p.product_id === invoice.product_id);
    console.log(product);

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
    if (this.creditNoteForm.valid) {
      // Check if history state has invoice data for update
      const creditNoteData = history.state.creditNoteData;

      if (creditNoteData) {
        // If invoice data exists in state, update the invoice
        this.modifyCreditNote(creditNoteData.id, this.creditNoteForm.value);
      } else {
        // Otherwise, add a new invoice
        this.createCreditNote(this.creditNoteForm.value);
      }
    }
  }

  createCreditNote(creditNoteData: any) {
    this.CreditNotesService.createCreditNote(creditNoteData).subscribe({
      next: (response) => {
        console.log('Invoice added successfully:', response);
        this.router.navigate(['/admin/sales/credit-notes']);  // Redirect to invoice list page after adding
      },
      error: (error) => {
        console.error('Error adding invoice:', error);
      }
    });
  }

  modifyCreditNote(invoiceId: number, updatedData: any) {
    this.CreditNotesService.modifyCreditNote(invoiceId, updatedData).subscribe({
      next: (response) => {
        console.log('Invoice updated successfully:', response);
        this.router.navigate(['/admin/sales/credit-notes']);  // Redirect to invoice list page after updating
      },
      error: (error) => {
        console.error('Error updating invoice:', error);
      }
    });
  }


  onReset(): void {
    this.creditNoteForm.reset();
  }
}