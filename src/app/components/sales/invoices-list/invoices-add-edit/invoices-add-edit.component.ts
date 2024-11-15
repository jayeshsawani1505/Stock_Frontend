import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../services/Customer.service';
import { InvoiceService } from '../../../../services/invoice.service';
import { ProductService } from '../../../../services/products.service';
import { SubProductService } from '../../../../services/subProduct.service';
import { SignatureService } from '../../../../services/signature.srvice';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-invoices-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatInputModule,
    RouterModule, MatFormFieldModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './invoices-add-edit.component.html',
  styleUrl: './invoices-add-edit.component.css'
})
export class InvoicesAddEditComponent implements OnInit {
  invoiceForm!: FormGroup;
  customerList: any[] = []; // Define customerList to store customer data
  productList: any[] = []; // Define productList to store product dataX
  subProductList: any[] = []; // Define subProductList to store product dataX
  signatureList: any[] = [];
  invoiceData: any;
  product_name: any;
  subproduct_name: any;
  isAddMode: boolean = true;
  signature_photo: any

  constructor(private fb: FormBuilder,
    private CustomerService: CustomerService,
    private productService: ProductService,
    private SubProductService: SubProductService,
    private invoiceService: InvoiceService,
    private SignatureService: SignatureService,
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
      subproduct_id: [0],
      quantity: ['', Validators.required],
      // unit: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0)]],
      notes: ['', Validators.required],
      terms_conditions: ['', Validators.required],
      total_amount: ['', [Validators.required, Validators.min(0)]],
      signature_id: [0]
    });
  }

  ngOnInit(): void {
    this.GetCustomers();
    this.GetProducts();
    this.GetSignatures();
    this.fetchinvoiceData();
    if (this.isAddMode === true) {
      this.generateInvoiceNumber();
    }
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

  generateInvoiceNumber() {
    this.invoiceService.generateInvoiceNumber().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.invoiceForm.patchValue({
            invoice_number: res.data?.invoice_number
          })
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
          if (this.isAddMode === false) {
            const product = this.productList.find(p => p.product_id === +this.invoiceData?.product_id);
            this.product_name = product ? product.product_name : null;
          }
        }
      }
    });
  }

  GetSignatures(): void {
    this.SignatureService.GetSignatures().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.signatures) {
          this.signatureList = res.signatures;
          if (this.isAddMode === false) {
            const selectedSignature = this.signatureList.find(signature => signature.signature_id === +this.invoiceData?.signature_id);
            this.signature_photo = environment.ImageUrl + selectedSignature.signature_photo
          }
        }
      }
    })
  }

  GetSubProductsByProductId(productId: any) {
    this.SubProductService.GetSubProductsByProductId(productId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.subProductList = res.subproducts; // Assign products data to productList
        if (this.isAddMode === false) {
          const selectedProduct = this.subProductList.find(product => product.subproduct_id === +this.invoiceData?.signature_id);
          this.subproduct_name = selectedProduct?.subproduct_name
        }
      }
    });
  }

  // Method to fetch customer data, either from route state or API
  fetchinvoiceData() {
    // Get customer data from history state (if available)
    this.invoiceData = history.state.invoiceData;

    if (this.invoiceData) {
      this.isAddMode = false
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
      signature_id: invoice.signature_id
    });
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

  onSubProductChange(event: Event): void {
    // Parse the selected product ID as an integer
    const selectedProductId = parseInt((event.target as HTMLSelectElement).value, 10);
    this.GetSubProductsByProductId(selectedProductId);
    console.log('Selected SubProduct ID:', selectedProductId);

    // Find the selected product from the productList
    const selectedProduct = this.subProductList.find(product => product.subproduct_id === selectedProductId);
    if (selectedProduct) {
      this.subproduct_name = selectedProduct?.subproduct_name
      console.log('Selected Product:', selectedProduct);
    }
  }

  onSignatureSelect(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    const selectedSignature = this.signatureList.find(signature => signature.signature_id === +selectedId);
    if (selectedSignature) {
      this.signature_photo = environment.ImageUrl + selectedSignature.signature_photo
      console.log('Signature Photo:', this.signature_photo);
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