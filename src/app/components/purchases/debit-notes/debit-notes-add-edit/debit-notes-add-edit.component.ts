import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionSelectionChange, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ProductService } from '../../../../services/products.service';
import { ReturnDebitNotesPurchaseService } from '../../../../services/return-debit-notes-purchases.service';
import { SignatureService } from '../../../../services/signature.srvice';
import { VendorService } from '../../../../services/vendors.service';
import { CategoryService } from '../../../../services/Category.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-debit-notes-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatInputModule,
    RouterModule, MatFormFieldModule, MatDatepickerModule, MatSnackBarModule,
    MatSelectModule, MatAutocompleteModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './debit-notes-add-edit.component.html',
  styleUrl: './debit-notes-add-edit.component.css'
})
export class DebitNotesAddEditComponent implements OnInit {
  purchaseForm!: FormGroup;
  vendorList: any[] = [];
  productList: any[] = [];
  signatureList: any[] = [];
  categoryList: any[] = [];
  purchaseData: any;
  product_name: any;
  isAddMode: boolean = true;
  signature_photo: any
  filteredCategories: any[] = [];
  filteredProducts: any[] = [];
  selectedProducts: { quantity: number; product_name: string }[] = []; // Stores selected product details per row
  selectedCustomer: any = null;

  constructor(
    private fb: FormBuilder,
    private VendorService: VendorService,
    private productService: ProductService,
    private ReturnDebitNotesPurchaseService: ReturnDebitNotesPurchaseService,
    private categoryService: CategoryService,
    private SignatureService: SignatureService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.purchaseForm = this.fb.group({
      vendor_id: ['', Validators.required],
      purchase_order_date: ['', Validators.required],
      due_date: [new Date()],
      reference_no: ['00', Validators.required],
      status: ['Pending', Validators.required],
      payment_mode: ['no'],
      product_id: [[]],
      subproduct_id: [[]],
      notes: [''],
      terms_conditions: [''],
      adjustmentType: [''],
      adjustmentValue: [0],
      adjustmentType2: [''],
      adjustmentValue2: [0],
      subtotal_amount: [''],
      opening_balance: [0],
      closing_balance: [0],
      total_amount: [0],
      signature_id: [0],
      invoice_details: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.GetVendors();
    this.GetCategories();
    this.GetProducts();
    this.GetSignatures();
    this.fetchPurchaseData();
    this.productFormArray.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });
  }

  calculateAdjustedTotal(): number {
    const subtotalAmount = this.purchaseForm.get('subtotal_amount')?.value || 0;
    const adjustmentValue = this.purchaseForm.get('adjustmentValue')?.value || 0;
    const opening_balance = this.purchaseForm.get('opening_balance')?.value || 0;
    // Calculate the adjusted total
    const totalAmount = subtotalAmount + adjustmentValue
    const totalAmount2 = subtotalAmount + opening_balance + adjustmentValue
    // Set the total_amount in the form
    this.purchaseForm.patchValue({
      total_amount: totalAmount,
      closing_balance: totalAmount2
    });
    return totalAmount;
  }

  calculateAdjustedTotal2(): number {
    const subtotalAmount = this.purchaseForm.get('subtotal_amount')?.value || 0;
    const adjustmentValue = this.purchaseForm.get('adjustmentValue')?.value || 0;
    const adjustmentValue2 = this.purchaseForm.get('adjustmentValue2')?.value || 0;
    const opening_balance = this.purchaseForm.get('opening_balance')?.value || 0;
    // Calculate the adjusted total
    const totalAmount = subtotalAmount + adjustmentValue + adjustmentValue2
    const totalAmount2 = subtotalAmount + adjustmentValue + opening_balance + adjustmentValue2
    // Set the total_amount in the form
    this.purchaseForm.patchValue({
      total_amount: totalAmount,
      closing_balance: totalAmount2
    });
    return totalAmount;
  }

  calculateTotalAmount() {
    const total = this.productFormArray.controls.reduce((sum, control) => {
      return sum + (control.get('subtotal_amount')?.value || 0);
    }, 0);
    this.purchaseForm.get('subtotal_amount')?.setValue(total)
    this.purchaseForm.get('total_amount')?.setValue(total)
    const dd = total + this.purchaseForm.value?.opening_balance
    this.purchaseForm.get('closing_balance')?.setValue(dd)
    console.log('Total Amount:', total);
  }

  // Fetch vendors
  GetVendors(): void {
    this.VendorService.GetVendors().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.vendors) {
          this.vendorList = res.vendors;
        }
      },
    });
  }

  GetCategories(): void {
    this.categoryService.GetCategories().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.categoryList = res.data;
        }
      }
    })
  }
  // GetProducts method
  GetProducts() {
    this.productService.GetProducts().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.products) {
          this.productList = res.products; // Assign products data to productList
          if (this.isAddMode === false) {
            const product = this.productList.find(p => p.product_id === +this.purchaseData?.product_id);
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
            const selectedSignature = this.signatureList.find(signature => signature.signature_id === +this.purchaseData?.signature_id);
            this.signature_photo = environment.ImageUrl + selectedSignature.signature_photo
          }
        }
      }
    })
  }


  // Method to fetch Purchase data, either from route state or API
  fetchPurchaseData() {
    // Get Purchase data from history state (if available)
    this.purchaseData = history.state.PurchaseData;

    if (this.purchaseData) {
      this.isAddMode = false;
      console.log(this.purchaseData);

      // Populate the form with the Purchase data
      this.populateForm(this.purchaseData);
    }
  }
  // Populate the form with the purchase data
  populateForm(purchase: any): void {
    this.purchaseForm.patchValue({
      vendor_id: purchase.vendor_id || '',
      purchase_order_date: purchase.purchase_order_date,
      due_date: purchase.due_date,
      reference_no: purchase.reference_no || '',
      status: purchase.status || 'Pending',
      payment_mode: purchase.payment_mode || '',
      product_id: purchase.product_id || '',
      subproduct_id: purchase.subproduct_id,
      quantity: purchase.quantity || '',
      rate: purchase.rate || '',
      notes: purchase.notes || '',
      terms_conditions: purchase.terms_conditions || '',
      total_amount: purchase.total_amount || '',
      signature_id: purchase.signature_id
    });

    // Clear the existing FormArray
    this.productFormArray.clear();

    // Parse and populate the `invoice_details` array
    let invoiceDetails: any[] = [];
    try {
      invoiceDetails = JSON.parse(purchase.invoice_details); // Parse the JSON string
    } catch (error) {
      console.error('Error parsing invoice_details:', error);
    }

    // Ensure it's an array and populate the FormArray
    if (Array.isArray(invoiceDetails)) {
      const productIds = [...new Set(invoiceDetails.map(detail => detail.product_id))];
      this.purchaseForm.get('product_id')?.setValue(productIds)
      invoiceDetails.forEach((detail: any) => {
        this.productFormArray.push(
          this.fb.group({
            category_id: [detail.category_id],
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
      this.purchaseForm.get('total_amount')?.setValue(totalOfTotalAmounts)
      console.log('Sum of Total Amounts:', totalOfTotalAmounts)
    } else {
      console.warn('invoice_details is not an array:', invoiceDetails);
    }
  }

  get productFormArray(): FormArray {
    return this.purchaseForm.get('invoice_details') as FormArray;
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
    const discount = row.get('discount')?.value || 0;
    const totalAmount = quantity * rate;
    const discountedAmount = (totalAmount * discount) / 100;
    const finalAmount = totalAmount - discountedAmount;
    row.get('subtotal_amount')?.setValue(finalAmount, { emitEvent: false });
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
    if (this.purchaseForm.valid) {
      // Check if history state has Purchase data for update
      const PurchaseData = history.state.PurchaseData;

      if (PurchaseData) {
        // If Purchase data exists in state, update the Purchase
        this.updatePurchase(PurchaseData.id, this.purchaseForm.value);
      } else {
        // Otherwise, add a new Purchase
        this.addPurchase(this.purchaseForm.value);
      }
    }
  }

  addPurchase(PurchaseData: any) {
    this.ReturnDebitNotesPurchaseService.addReturnDebitNotePurchase(PurchaseData).subscribe({
      next: (response) => {
        console.log('Purchase added successfully:', response);
        this.router.navigate(['/admin/purchases/debit-notes']);  // Redirect to Purchase list page after adding
        this.openSnackBar('error', 'Close');
      },
      error: (error) => {
        console.error('Error adding Purchase:', error);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  updatePurchase(PurchaseId: number, updatedData: any) {
    this.ReturnDebitNotesPurchaseService.updateReturnDebitNotePurchase(PurchaseId, updatedData).subscribe({
      next: (response) => {
        console.log('Purchase updated successfully:', response);
        this.router.navigate(['/admin/purchases/debit-notes']);  // Redirect to Purchase list page after updating
        this.openSnackBar('error', 'Close');
      },
      error: (error) => {
        console.error('Error updating Purchase:', error);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  onReset(): void {
    this.purchaseForm.reset();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}
