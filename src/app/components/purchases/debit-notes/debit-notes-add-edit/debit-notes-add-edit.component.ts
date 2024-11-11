import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/products.service';
import { VendorService } from '../../../../services/vendors.service';
import { ReturnDebitNotesPurchaseService } from '../../../../services/return-debit-notes-purchases.service';

@Component({
  selector: 'app-debit-notes-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './debit-notes-add-edit.component.html',
  styleUrl: './debit-notes-add-edit.component.css'
})
export class DebitNotesAddEditComponent implements OnInit {
  purchaseForm!: FormGroup;
  vendorList: any[] = [];
  productList: any[] = [];
  purchaseData: any;
  product_name: any;

  constructor(
    private fb: FormBuilder,
    private VendorService: VendorService,
    private productService: ProductService,
    private ReturnDebitNotesPurchaseService: ReturnDebitNotesPurchaseService,
    private router: Router
  ) {
    this.purchaseForm = this.fb.group({
      vendor_id: ['', Validators.required],
      purchase_order_date: ['', Validators.required],
      due_date: ['', Validators.required],
      reference_no: ['', Validators.required],
      status: ['Pending', Validators.required],
      payment_mode: ['', Validators.required],
      product_id: ['', Validators.required],
      quantity: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0)]],
      notes: ['', Validators.required],
      terms_conditions: ['', Validators.required],
      total_amount: ['', [Validators.required, Validators.min(0)]]
    })
  }

  ngOnInit(): void {
    this.GetVendors();
    this.GetProducts();
    this.fetchPurchaseData();
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

  // Method to fetch Purchase data, either from route state or API
  fetchPurchaseData() {
    // Get Purchase data from history state (if available)
    this.purchaseData = history.state.PurchaseData;

    if (this.purchaseData) {
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
      quantity: purchase.quantity || '',
      rate: purchase.rate || '',
      notes: purchase.notes || '',
      terms_conditions: purchase.terms_conditions || '',
      total_amount: purchase.total_amount || ''
    });
    const product = this.productList.find(p => p.product_id === purchase.product_id);
    this.product_name = product ? product.product_name : null;
  }

  onProductChange(event: Event): void {
    // Parse the selected product ID as an integer
    const selectedProductId = parseInt((event.target as HTMLSelectElement).value, 10);
    console.log('Selected Product ID:', selectedProductId);

    // Find the selected product from the productList
    const selectedProduct = this.productList.find(product => product.product_id === selectedProductId);
    if (selectedProduct) {
      this.product_name = selectedProduct?.product_name
      console.log('Selected Product:', selectedProduct);
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
      },
      error: (error) => {
        console.error('Error adding Purchase:', error);
      }
    });
  }

  updatePurchase(PurchaseId: number, updatedData: any) {
    this.ReturnDebitNotesPurchaseService.updateReturnDebitNotePurchase(PurchaseId, updatedData).subscribe({
      next: (response) => {
        console.log('Purchase updated successfully:', response);
        this.router.navigate(['/admin/purchases/debit-notes']);  // Redirect to Purchase list page after updating
      },
      error: (error) => {
        console.error('Error updating Purchase:', error);
      }
    });
  }


  onReset(): void {
    this.purchaseForm.reset();
  }
}
