import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../../services/Category.service';
import { ProductService } from '../../../../services/products.service';

@Component({
  selector: 'app-product-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  providers: [CategoryService, ProductService],
  templateUrl: './product-add-edit.component.html',
  styleUrl: './product-add-edit.component.css'
})
export class ProductAddEditComponent implements OnInit {
  productForm!: FormGroup;
  categoryList: any[] = [];
  productData: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,) {
    this.productForm = this.fb.group({
      item_type: ['Product', Validators.required],
      product_name: ['', Validators.required],
      product_code: ['', Validators.required],
      category_id: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      selling_price: ['', [Validators.required, Validators.min(0)]],
      purchase_price: ['', [Validators.required, Validators.min(0)]],
      units: ['pcs', Validators.required],
      alert_quantity: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      product_image: [''],
    });
  }

  ngOnInit(): void {
    this.GetCategories();
    this.fetchCustomerData();
  }

  // Fetch categories
  GetCategories(): void {
    this.categoryService.GetCategories().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.categoryList = res.data;
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
      this.populateForm(this.productData);
    }
  }

  populateForm(product: any) {
    this.productForm.patchValue({
      item_type: product.item_type,
      product_name: product.product_name,
      product_code: product.product_code,
      category_id: product.category_id,
      quantity: product.quantity,
      selling_price: product.selling_price,
      purchase_price: product.purchase_price,
      units: product.units,
      alert_quantity: product.alert_quantity,
      description: product.description,
      product_image: product.product_image
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
    this.productService.AddProduct(productData).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
        this.router.navigate(['/admin/productsServices/product-list']);
      },
      error: (error) => {
        console.error('Error adding product:', error);
      }
    });
  }

  updateProduct(productId: number, updatedData: any) {
    this.productService.UpdateProduct(productId, updatedData).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        this.router.navigate(['/admin/productsServices/product-list']);
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
  }
}