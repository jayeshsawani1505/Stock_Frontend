import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/products.service';
import { SubProductService } from '../../../../services/subProduct.service';

@Component({
  selector: 'app-sub-product-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  providers: [SubProductService, ProductService],
  templateUrl: './sub-product-add-edit.component.html',
  styleUrl: './sub-product-add-edit.component.css'
})
export class SubProductAddEditComponent implements OnInit {
  productForm!: FormGroup;
  productList: any[] = [];
  productData: any;
  isAddMode: boolean = true;

  constructor(private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private SubProductService: SubProductService,
  ) {
    this.productForm = this.fb.group({
      product_id: ['', Validators.required],
      subproduct_name: ['', Validators.required],
      subproduct_code: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      selling_price: ['', [Validators.required, Validators.min(0)]],
      purchase_price: ['', [Validators.required, Validators.min(0)]],
      units: ['pcs', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.GetProducts();
    this.fetchCustomerData();
  }

  // Fetch categories
  GetProducts() {
    this.productService.GetProducts().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.products) {
          this.productList = res.products;
        }
      },
      error: (err: any) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  fetchCustomerData() {
    this.productData = history.state.productData;
    if (this.productData) {
      this.isAddMode = false;
      this.populateForm(this.productData);
    }
  }

  populateForm(product: any) {
    this.productForm.patchValue({
      product_id: product.product_id,
      subproduct_name: product.subproduct_name,
      subproduct_code: product.subproduct_code,
      quantity: product.quantity,
      selling_price: product.selling_price,
      purchase_price: product.purchase_price,
      units: product.units,
      description: product.description
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = history.state.productData;

      if (productData) {
        this.updateProduct(productData.product_id, this.productForm.value);
      } else {
        this.addProduct(this.productForm.value);
      }
    }
  }

  addProduct(productData: any) {
    this.SubProductService.AddSubProduct(productData).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
        this.router.navigate(['/admin/productsServices/subProduct-list']);
      },
      error: (error) => {
        console.error('Error adding product:', error);
      }
    });
  }

  updateProduct(subproduct_id: number, updatedData: any) {
    this.SubProductService.UpdateSubProduct(subproduct_id, updatedData).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        this.router.navigate(['/admin/productsServices/subProduct-list']);
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
  }
}