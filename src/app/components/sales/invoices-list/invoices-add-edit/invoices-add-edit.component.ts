import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CustomerService } from '../../../../services/Customer.service';
import { InvoiceService } from '../../../../services/invoice.service';
import { ProductService } from '../../../../services/products.service';
import { SignatureService } from '../../../../services/signature.srvice';
import { SubProductService } from '../../../../services/subProduct.service';

@Component({
  selector: 'app-invoices-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatInputModule,
    RouterModule, MatFormFieldModule, MatDatepickerModule, MatSnackBarModule,
    MatSelectModule],
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
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.invoiceForm = this.fb.group({
      invoice_number: ['', Validators.required],
      customer_id: ['', Validators.required],
      invoice_date: ['', Validators.required],
      due_date: ['', Validators.required],
      transpoter_name: ['', Validators.required],
      status: ['Pending', Validators.required],
      product_id: [[]],
      subproduct_id: [[]],
      notes: ['', Validators.required],
      terms_conditions: ['', Validators.required],
      total_amount: ['',],
      signature_id: [0],
      invoice_details: this.fb.array([]), // FormArray for the table rows
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
    this.productFormArray.controls.forEach((control, index) => {
      // Watch for changes in 'quantity' and 'rate'
      control.get('quantity')?.valueChanges.subscribe(() => {
        this.updateAmount(index);
        this.calculateTotalAmount(); // Recalculate total after updating the row
      });

      control.get('rate')?.valueChanges.subscribe(() => {
        this.updateAmount(index);
        this.calculateTotalAmount(); // Recalculate total after updating the row
      });
    });
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    const total = this.productFormArray.controls.reduce((sum, control) => {
      return sum + (control.get('total_amount')?.value || 0);
    }, 0);
    this.invoiceForm.get('total_amount')?.setValue(total)
    console.log('Total Amount:', total);
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
      transpoter_name: invoice.transpoter_name,
      status: invoice.status,
      recurring_cycle: invoice.recurring_cycle,
      product_id: invoice.product_id,
      notes: invoice.notes,
      terms_conditions: invoice.terms_conditions,
      total_amount: invoice.total_amount,
      signature_id: invoice.signature_id,
    });

    // Clear the existing FormArray
    this.productFormArray.clear();

    // Parse and populate the `invoice_details` array
    let invoiceDetails: any[] = [];
    try {
      invoiceDetails = JSON.parse(invoice.invoice_details); // Parse the JSON string
    } catch (error) {
      console.error('Error parsing invoice_details:', error);
    }

    // Ensure it's an array and populate the FormArray
    if (Array.isArray(invoiceDetails)) {
      const productIds = [...new Set(invoiceDetails.map(detail => detail.product_id))];
      this.invoiceForm.get('product_id')?.setValue(productIds)
      invoiceDetails.forEach((detail: any) => {
        this.productFormArray.push(
          this.fb.group({
            product_id: [detail.product_id],
            subproduct_id: [detail.subproduct_id],
            quantity: [detail.quantity],
            unit: [detail.unit],
            rate: [detail.rate],
            total_amount: [detail.total_amount],
          })
        );
      });
      const totalAmounts = this.productFormArray.controls.map((control) =>
        control.get('total_amount')?.value || 0
      );
      const totalOfTotalAmounts = totalAmounts.reduce((acc, value) => acc + value, 0);
      this.invoiceForm.get('total_amount')?.setValue(totalOfTotalAmounts)
      console.log('Sum of Total Amounts:', totalOfTotalAmounts)
    } else {
      console.warn('invoice_details is not an array:', invoiceDetails);
    }
  }

  get productFormArray(): FormArray {
    return this.invoiceForm.get('invoice_details') as FormArray;
  }

  onProductChange(event: any): void {
    const selectedProductIds = event.value; // Assuming this is an array of selected product IDs

    const selectedProducts = this.productList.filter(product =>
      selectedProductIds.includes(product.product_id)
    );

    // Clear the existing form array and add new form groups for each selected product
    this.productFormArray.clear();

    selectedProducts.forEach(product => {
      this.productFormArray.push(
        this.fb.group({
          product_id: [product.product_id],
          subproduct_id: [null], // Or set a default subproduct value
          quantity: [0],
          unit: ['box'],
          rate: [0],
          total_amount: [0],
        })
      );
    });
  }

  onSubProductChange(event: any): void {
    const selectedSubProductIds = event.value;
    const selectedSubProducts = this.subProductList.filter(product =>
      selectedSubProductIds.includes(product.subproduct_id)
    );
    this.productFormArray.clear();
    selectedSubProducts.forEach(subProduct => {
      this.productFormArray.push(
        this.fb.group({
          subproduct_id: [subProduct.subproduct_id],
          product_id: [subProduct.product_id],
          quantity: [0],
          unit: ['box'],
          rate: [0],
          total_amount: [0],
        })
      );
    });
  }

  updateAmount(index: number): void {
    const row = this.productFormArray.at(index);
    const quantity = row.get('quantity')?.value || 0;
    const rate = row.get('rate')?.value || 0;
    const totalAmount = quantity * rate;
    row.get('total_amount')?.setValue(totalAmount, { emitEvent: false });
    this.calculateTotalAmount();
  }

  getProductName(product_id: number): string {
    const product = this.productList.find(prod => prod.product_id === product_id);
    return product ? product.product_name : '';
  }

  getSubProductName(subproduct_id: number): string {
    const subProduct = this.subProductList.find(product => product.subproduct_id === subproduct_id);
    return subProduct ? subProduct.subproduct_name : '';
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
        this.openSnackBar('Added Successfully', 'Close');
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
        this.openSnackBar('Update Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error updating invoice:', error);
      }
    });
  }

  onReset(): void {
    this.invoiceForm.reset();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}