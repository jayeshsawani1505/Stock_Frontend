import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/products.service';
import { PurchaseService } from '../../../../services/purchases.service';
import { SubProductService } from '../../../../services/subProduct.service';
import { VendorService } from '../../../../services/vendors.service';
import { SignatureService } from '../../../../services/signature.srvice';

@Component({
  selector: 'app-purchase-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatInputModule,
    RouterModule, MatFormFieldModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './purchase-add-edit.component.html',
  styleUrl: './purchase-add-edit.component.css'
})
export class PurchaseAddEditComponent implements OnInit {
  purchaseForm!: FormGroup;
  vendorList: any[] = [];
  productList: any[] = [];
  subProductList: any[] = []; // Define subProductList to store product dataX
  purchaseData: any;
  product_name: any;
  isAddMode: boolean = true;
  signatureList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private VendorService: VendorService,
    private productService: ProductService,
    private PurchaseService: PurchaseService,
    private SubProductService: SubProductService,
    private SignatureService: SignatureService,
    private router: Router
  ) {
    this.purchaseForm = this.fb.group({
      vendor_id: ['', Validators.required],
      purchase_date: ['', Validators.required],
      due_date: ['', Validators.required],
      reference_no: ['', Validators.required],
      status: ['Pending', Validators.required],
      supplier_invoice_serial_no: ['', Validators.required],
      payment_mode: ['', Validators.required],
      product_id: ['', Validators.required],
      subproduct_id: [0],
      quantity: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0)]],
      notes: ['', Validators.required],
      terms_conditions: ['', Validators.required],
      total_amount: ['', [Validators.required, Validators.min(0)]],
      signature_id: [0]
    })
  }

  ngOnInit(): void {
    this.GetVendors();
    this.GetProducts();
    this.fetchPurchaseData();
    this.GetSignatures();
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

  GetSignatures(): void {
    this.SignatureService.GetSignatures().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.signatures) {
          this.signatureList = res.signatures;
        }
      }
    })
  }

  GetSubProductsByProductId(productId: any) {
    this.SubProductService.GetSubProductsByProductId(productId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.subProductList = res.subproducts; // Assign products data to productList
      }
    });
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
    this.GetSubProductsByProductId(purchase.product_id,)
    this.purchaseForm.patchValue({
      vendor_id: purchase.vendor_id || '',
      purchase_date: purchase.purchase_date,
      due_date: purchase.due_date,
      reference_no: purchase.reference_no || '',
      status: purchase.status || 'Pending',
      supplier_invoice_serial_no: purchase.supplier_invoice_serial_no || '',
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
    const product = this.productList.find(p => p.product_id === purchase.product_id);
    this.product_name = product ? product.product_name : null;
  }

  onProductChange(event: Event): void {
    // Parse the selected product ID as an integer
    const selectedProductId = parseInt((event.target as HTMLSelectElement).value, 10);
    console.log('Selected Product ID:', selectedProductId);
    this.GetSubProductsByProductId(selectedProductId);

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
    this.PurchaseService.addPurchase(PurchaseData).subscribe({
      next: (response) => {
        console.log('Purchase added successfully:', response);
        this.router.navigate(['/admin/purchases/list']);  // Redirect to Purchase list page after adding
      },
      error: (error) => {
        console.error('Error adding Purchase:', error);
      }
    });
  }

  updatePurchase(PurchaseId: number, updatedData: any) {
    this.PurchaseService.updatePurchase(PurchaseId, updatedData).subscribe({
      next: (response) => {
        console.log('Purchase updated successfully:', response);
        this.router.navigate(['/admin/purchases/list']);  // Redirect to Purchase list page after updating
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
