import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionSelectionChange, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CategoryService } from '../../../../services/Category.service';
import { CustomerService } from '../../../../services/Customer.service';
import { InvoiceService } from '../../../../services/invoice.service';
import { ProductService } from '../../../../services/products.service';
import { SignatureService } from '../../../../services/signature.srvice';

@Component({
  selector: 'app-invoices-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatInputModule,
    RouterModule, MatFormFieldModule, MatDatepickerModule, MatSnackBarModule,
    MatSelectModule, MatAutocompleteModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './invoices-add-edit.component.html',
  styleUrl: './invoices-add-edit.component.css'
})
export class InvoicesAddEditComponent implements OnInit {
  invoiceForm!: FormGroup;
  customerList: any[] = []; // Define customerList to store customer data
  productList: any[] = []; // Define productList to store product dataX
  signatureList: any[] = [];
  categoryList: any[] = [];
  invoiceData: any;
  product_name: any;
  subproduct_name: any;
  isAddMode: boolean = true;
  signature_photo: any;
  filteredCategories: any[] = [];
  filteredProducts: any[] = [];
  selectedProducts: { quantity: number; product_name: string }[] = []; // Stores selected product details per row

  constructor(private fb: FormBuilder,
    private CustomerService: CustomerService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private SignatureService: SignatureService,
    private categoryService: CategoryService,
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
      category_id: [''],
      product_id: [''],
      subproduct_id: [[]],
      notes: ['', Validators.required],
      terms_conditions: ['', Validators.required],
      adjustmentType: ['add'],
      adjustmentValue: [0],
      subtotal_amount: [''],
      total_amount: [0],
      signature_id: [0],
      invoice_details: this.fb.array([]), // FormArray for the table rows
    });
  }

  ngOnInit(): void {
    this.GetCustomers();
    this.GetCategories();
    this.GetSignatures();
    this.fetchinvoiceData();
    if (this.isAddMode === true) {
      this.generateInvoiceNumber();
    }
    this.addRow();
    // this.addDefaultRows(5); // Add 5 default rows
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
  calculateAdjustedTotal(): number {
    const subtotalAmount = this.invoiceForm.get('subtotal_amount')?.value || 0;
    const adjustmentType = this.invoiceForm.get('adjustmentType')?.value;
    const adjustmentValue = this.invoiceForm.get('adjustmentValue')?.value || 0;

    // Calculate the adjusted total
    const totalAmount =
      adjustmentType === 'add'
        ? subtotalAmount + adjustmentValue
        : subtotalAmount - adjustmentValue;

    // Set the total_amount in the form
    this.invoiceForm.patchValue({ total_amount: totalAmount });

    return totalAmount;
  }

  calculateTotalAmount() {
    const total = this.productFormArray.controls.reduce((sum, control) => {
      return sum + (control.get('subtotal_amount')?.value || 0);
    }, 0);
    this.invoiceForm.get('subtotal_amount')?.setValue(total)
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

  GetCategories(): void {
    this.categoryService.GetCategories().subscribe({
      next: (res: any) => {
        this.GetProducts()
        console.log(res);
        if (res && res.data) {
          this.categoryList = res.data;
        }
      }
    })
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
    // this.GetSubProductsByProductId(invoice.product_id,)
    this.invoiceForm.patchValue({
      invoice_number: invoice.invoice_number,
      customer_id: invoice.customer_id,
      invoice_date: new Date(invoice.invoice_date),
      due_date: new Date(invoice.due_date),
      transpoter_name: invoice.transpoter_name,
      category_id: invoice.category_id,
      status: invoice.status,
      recurring_cycle: invoice.recurring_cycle,
      product_id: invoice.product_id,
      notes: invoice.notes,
      terms_conditions: invoice.terms_conditions,
      subtotal_amount: invoice.subtotal_amount,
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
            subtotal_amount: [detail.subtotal_amount],
          })
        );
      });
      const totalAmounts = this.productFormArray.controls.map((control) =>
        control.get('subtotal_amount')?.value || 0
      );
      const totalOfTotalAmounts = totalAmounts.reduce((acc, value) => acc + value, 0);
      this.invoiceForm.get('subtotal_amount')?.setValue(totalOfTotalAmounts)
      console.log('Sum of Total Amounts:', totalOfTotalAmounts)
    } else {
      console.warn('invoice_details is not an array:', invoiceDetails);
    }
  }

  get productFormArray(): FormArray {
    return this.invoiceForm.get('invoice_details') as FormArray;
  }

  onCategoryChange(event: any): void {
    const selectedCategoryId = event.value;
    console.log(selectedCategoryId);
  }

  addRow(): void {
    const newRow = this.fb.group({
      category_name: [null],
      product_name: [null],
      quantity: [0],
      unit: ['piece'],
      rate: [0],
      subtotal_amount: [0],
    });
    this.productFormArray.push(newRow);
    this.filteredCategories.push(this.categoryList);
    this.filteredProducts.push([]);
    this.selectedProducts.push({ quantity: 0, product_name: '' }); // Add placeholder for selected product
  }


  filterCategory(i: number): void {
    const categoryControl = this.productFormArray.at(i).get('category_name');
    const searchTerm = categoryControl?.value;
    this.filteredCategories[i] = this.categoryList.filter(category =>
      category.category_name.toLowerCase().includes(searchTerm ? searchTerm.toLowerCase() : '')
    );

    // Reset product_name field when category changes
    this.productFormArray.at(i).get('product_name')?.reset();
    this.filteredProducts[i] = [];
  }

  filterProduct(i: number): void {
    const productControl = this.productFormArray.at(i).get('product_name');
    const searchTerm = productControl?.value;

    const categoryName = this.productFormArray.at(i).get('category_name')?.value;
    const selectedCategory = this.categoryList.find(category => category.category_name === categoryName);

    if (selectedCategory) {
      this.filteredProducts[i] = this.productList.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm ? searchTerm.toLowerCase() : '') &&
        product.category_id === selectedCategory.category_id
      );
    } else {
      this.filteredProducts[i] = [];
    }
  }
  onProductChange(product: any, event: MatOptionSelectionChange, index: number): void {
    if (event.isUserInput) {
      const productDetails = this.productList.find(p => p.product_id === product.product_id);

      if (productDetails) {
        // Store the selected product's details
        this.selectedProducts[index] = {
          quantity: productDetails.quantity,
          product_name: productDetails.product_name
        };

        // Optionally reset the quantity to 0 when the product is changed
        this.productFormArray.at(index).get('quantity')?.setValue(0);
      }
    }
  }

  // Validate the entered quantity
  validateQuantity(index: number): void {
    const selectedProduct = this.selectedProducts[index]; // Get the selected product for the row
    const quantityControl = this.productFormArray.at(index).get('quantity');

    if (quantityControl && selectedProduct) {
      const enteredQuantity = quantityControl.value;

      if (enteredQuantity > selectedProduct.quantity) {
        // If the entered quantity exceeds the available quantity
        quantityControl.setValue(selectedProduct.quantity); // Reset to the maximum available quantity
        alert(`Maximum available quantity for ${selectedProduct.product_name} is ${selectedProduct.quantity}`);
      } else if (enteredQuantity < 0) {
        // Prevent negative quantities
        quantityControl.setValue(0);
      }
    }
  }
  updateAmount(index: number): void {
    const row = this.productFormArray.at(index);
    const quantity = row.get('quantity')?.value || 0;
    const rate = row.get('rate')?.value || 0;
    const totalAmount = quantity * rate;
    row.get('subtotal_amount')?.setValue(totalAmount, { emitEvent: false });
    this.calculateTotalAmount();
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