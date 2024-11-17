import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../services/Customer.service';
import { ProductService } from '../../../../services/products.service';
import { SubProductService } from '../../../../services/subProduct.service';
import { QuotationService } from '../../../../services/quotation.service';
import { SignatureService } from '../../../../services/signature.srvice';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-delivery-challans-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatInputModule,
    RouterModule, MatFormFieldModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './delivery-challans-add-edit.component.html',
  styleUrl: './delivery-challans-add-edit.component.css'
})
export class DeliveryChallansAddEditComponent {
  QuotationForm!: FormGroup;
  customerList: any[] = []; // Define customerList to store customer data
  productList: any[] = []; // Define productList to store product dataX
  subProductList: any[] = []; // Define subProductList to store product dataX
  signatureList: any[] = [];
  QuotationData: any;
  product_name: any;
  subproduct_name: any;
  isAddMode: boolean = true;
  signature_photo: any

  constructor(private fb: FormBuilder,
    private CustomerService: CustomerService,
    private productService: ProductService,
    private SubProductService: SubProductService,
    private QuotationService: QuotationService,
    private SignatureService: SignatureService,
    private router: Router
  ) {
    this.QuotationForm = this.fb.group({
      delivery_number: ['', Validators.required],
      delivery_date: ['', Validators.required],
      customer_id: ['', Validators.required],
      due_date: ['', Validators.required],
      status: ['', Validators.required],
      product_id: ['', Validators.required],
      subproduct_id: [0],
      quantity: ['', Validators.required],
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
    this.fetchQuotationData();
    if (this.isAddMode === true) {
      this.generateDeliveryChallanNumber();
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

  generateDeliveryChallanNumber() {
    this.QuotationService.generateDeliveryChallanNumber().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.QuotationForm.patchValue({
            delivery_number: res.data?.Delivery_Challan_number
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
            const product = this.productList.find(p => p.product_id === +this.QuotationData?.product_id);
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
            const selectedSignature = this.signatureList.find(signature => signature.signature_id === +this.QuotationData?.signature_id);
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
          const selectedProduct = this.subProductList.find(product => product.subproduct_id === +this.QuotationData?.signature_id);
          this.subproduct_name = selectedProduct?.subproduct_name
        }
      }
    });
  }

  // Method to fetch customer data, either from route state or API
  fetchQuotationData() {
    // Get customer data from history state (if available)
    this.QuotationData = history.state.QuotationData;

    if (this.QuotationData) {
      this.isAddMode = false
      console.log(this.QuotationData);

      // Populate the form with the customer data
      this.populateForm(this.QuotationData);
    }
  }

  // Populate the form with the quotation data
  populateForm(quotation: any): void {
    this.GetSubProductsByProductId(quotation.product_id,)
    this.QuotationForm.patchValue({
      delivery_number: quotation.delivery_number,
      customer_id: quotation.customer_id,
      delivery_date: new Date(quotation.delivery_date),
      due_date: new Date(quotation.due_date),
      status: quotation.status,
      product_id: quotation.product_id,
      subproduct_id: quotation.subproduct_id,
      notes: quotation.notes,
      terms_conditions: quotation.terms_conditions,
      quantity: quotation.quantity,
      rate: quotation.rate,
      total_amount: quotation.total_amount,
      signature_id: quotation.signature_id
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
    if (this.QuotationForm.valid) {
      // Check if history state has quotation data for update
      const QuotationData = history.state.QuotationData;

      if (QuotationData) {
        // If quotation data exists in state, update the quotation
        this.updateQuotation(QuotationData.id, this.QuotationForm.value);
      } else {
        // Otherwise, add a new quotation
        this.addQuotation(this.QuotationForm.value);
      }
    }
  }

  addQuotation(QuotationData: any) {
    this.QuotationService.addDeliveryChallan(QuotationData).subscribe({
      next: (response) => {
        console.log('Q added successfully:', response);
        this.router.navigate(['/admin/quotations/delivery-challans']);  // Redirect to quotation list page after adding
      },
      error: (error) => {
        console.error('Error adding quotation:', error);
      }
    });
  }

  updateQuotation(quotationId: any, updatedData: any) {
    this.QuotationService.updateDeliveryChallan(quotationId, updatedData).subscribe({
      next: (response) => {
        console.log('quotation updated successfully:', response);
        this.router.navigate(['/admin/quotations/delivery-challans']);  // Redirect to quotation list page after updating
      },
      error: (error) => {
        console.error('Error updating invoice:', error);
      }
    });
  }

  onReset(): void {
    this.QuotationForm.reset();
  }
}
