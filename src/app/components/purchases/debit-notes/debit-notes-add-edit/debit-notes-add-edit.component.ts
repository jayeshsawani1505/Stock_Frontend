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
import { ProductService } from '../../../../services/products.service';
import { ReturnDebitNotesPurchaseService } from '../../../../services/return-debit-notes-purchases.service';
import { SignatureService } from '../../../../services/signature.srvice';
import { VendorService } from '../../../../services/vendors.service';
import { CategoryService } from '../../../../services/Category.service';

@Component({
  selector: 'app-debit-notes-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatInputModule,
    RouterModule, MatFormFieldModule, MatDatepickerModule, MatSnackBarModule,
    MatSelectModule],
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
      due_date: ['', Validators.required],
      reference_no: ['00', Validators.required],
      status: ['Pending', Validators.required],
      payment_mode: ['', Validators.required],
      product_id: [[]],
      subproduct_id: [[]],
      notes: ['', Validators.required],
      terms_conditions: ['', Validators.required],
      total_amount: ['',],
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

  calculateTotalAmount() {
    // Sum up the total_amount from the FormArray
    const total = this.productFormArray.controls.reduce((sum, control) => {
      return sum + (control.get('total_amount')?.value || 0);
    }, 0);
    this.purchaseForm.get('total_amount')?.setValue(total)
    // Log the total to the console
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
      category_id: [null, Validators.required],
      product_id: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      unit: ['piece', Validators.required],
      rate: [0, [Validators.required, Validators.min(0)]],
      total_amount: [0],
    });
    this.productFormArray.push(newRow);
  }

  updateAmount(index: number): void {
    const row = this.productFormArray.at(index);
    const quantity = row.get('quantity')?.value || 0;
    const rate = row.get('rate')?.value || 0;
    const totalAmount = quantity * rate;

    // Update total_amount and trigger total calculation
    row.get('total_amount')?.setValue(totalAmount, { emitEvent: false });

    // Manually recalculate the total after updating the row
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
