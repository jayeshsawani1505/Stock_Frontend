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
import { ProductService } from '../../../../services/products.service';
import { QuotationService } from '../../../../services/quotation.service';
import { SignatureService } from '../../../../services/signature.srvice';
import { SubProductService } from '../../../../services/subProduct.service';

@Component({
  selector: 'app-delivery-challans-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatInputModule,
    RouterModule, MatFormFieldModule, MatDatepickerModule, MatSnackBarModule,
    MatSelectModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './delivery-challans-add-edit.component.html',
  styleUrl: './delivery-challans-add-edit.component.css'
})
export class DeliveryChallansAddEditComponent implements OnInit {
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
    private router: Router, private snackBar: MatSnackBar,
  ) {
    this.QuotationForm = this.fb.group({
      delivery_number: ['', Validators.required],
      delivery_date: ['', Validators.required],
      customer_id: ['', Validators.required],
      due_date: ['', Validators.required],
      status: ['', Validators.required],
      product_id: [[]],
      subproduct_id: [[]],
      notes: ['', Validators.required],
      terms_conditions: ['', Validators.required],
      total_amount: ['',],
      signature_id: [0],
      invoice_details: this.fb.array([]),
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
    this.productFormArray.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });
  }

  calculateTotalAmount() {
    // Sum up the total_amount from the FormArray
    const total = this.productFormArray.controls.reduce((sum, control) => {
      return sum + (control.get('total_amount')?.value || 0);
    }, 0);
    this.QuotationForm.get('total_amount')?.setValue(total)
    // Log the total to the console
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

    // Clear the existing FormArray
    this.productFormArray.clear();

    // Parse and populate the `invoice_details` array
    let invoiceDetails: any[] = [];
    try {
      invoiceDetails = JSON.parse(quotation.invoice_details); // Parse the JSON string
    } catch (error) {
      console.error('Error parsing invoice_details:', error);
    }

    // Ensure it's an array and populate the FormArray
    if (Array.isArray(invoiceDetails)) {
      const productIds = [...new Set(invoiceDetails.map(detail => detail.product_id))];
      this.QuotationForm.get('product_id')?.setValue(productIds)
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
      this.QuotationForm.get('total_amount')?.setValue(totalOfTotalAmounts)
      console.log('Sum of Total Amounts:', totalOfTotalAmounts)
    } else {
      console.warn('invoice_details is not an array:', invoiceDetails);
    }
  }

  get productFormArray(): FormArray {
    return this.QuotationForm.get('invoice_details') as FormArray;
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

    // Update total_amount and trigger total calculation
    row.get('total_amount')?.setValue(totalAmount, { emitEvent: false });

    // Manually recalculate the total after updating the row
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
        this.openSnackBar('Added Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error adding quotation:', error);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  updateQuotation(quotationId: any, updatedData: any) {
    this.QuotationService.updateDeliveryChallan(quotationId, updatedData).subscribe({
      next: (response) => {
        console.log('quotation updated successfully:', response);
        this.router.navigate(['/admin/quotations/delivery-challans']);  // Redirect to quotation list page after updating
        this.openSnackBar('Update Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error updating invoice:', error);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  onReset(): void {
    this.QuotationForm.reset();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}
