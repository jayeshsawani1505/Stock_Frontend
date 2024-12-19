import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../../services/Category.service';
import { ProductService } from '../../../../services/products.service';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-product-add-edit',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule,
    MatSnackBarModule, MatAutocompleteModule, MatInputModule],
  providers: [CategoryService, ProductService],
  templateUrl: './product-add-edit.component.html',
  styleUrl: './product-add-edit.component.css'
})
export class ProductAddEditComponent implements OnInit {
  productForm!: FormGroup;
  categoryList: any[] = [];
  productData: any;
  imageUrl: string | ArrayBuffer | null = null;
  fileName: string = '';
  selectedFile: File | null = null;
  isAddMode: boolean = true;
  imgURL = environment.ImageUrl
  customerControl = new FormControl('');
  filteredCustomers!: Observable<any[]>;

  constructor(private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {
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
    // Initialize filteredCustomers based on customerControl input changes
    this.filteredCustomers = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomers(value))
    );
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
          if (this.productData?.category_id) {
            const selectedData = this.categoryList.find(data => data.category_id === this.productData?.category_id);
            if (selectedData) {
              this.customerControl.setValue(`${selectedData.category_name}`);
            }
          }
        }
      },
      error: (err: any) => {
        console.error('Error fetching categories:', err);
      }
    });
  }
  // Filter the customers based on the search input
  private _filterCustomers(value: string | null): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.categoryList.filter(invoice =>
      `${invoice.category_name}`.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any): void {
    const selectedInvoice = event.option.value; // This will give the full invoice object
    console.log(selectedInvoice);
    this.productForm.get('category_id')?.setValue(selectedInvoice.category_id); // Set the category_id to the selected invoice's id
    this.customerControl.setValue(selectedInvoice.category_name); // Update the customer name field
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
    this.imageUrl = this.imgURL + product.product_image,
      this.selectedFile = product.product_image
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.isFileSizeValid(file)) {
        this.previewFile(file);
      } else {
        this.removeImage();
      }
    }
  }

  private isFileSizeValid(file: File): boolean {
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert 2 MB to bytes
    const isValid = file.size <= maxSizeInBytes;

    if (!isValid) {
      alert('File size exceeds 2 MB. Please select a smaller file.');
    }

    return isValid;
  }

  private previewFile(file: File): void {
    this.fileName = file.name;
    this.selectedFile = file;

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imageUrl = null;
    this.fileName = '';
    this.selectedFile = null;
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
    this.productService.AddProduct(productData, this.selectedFile || undefined).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
        this.router.navigate(['/admin/productsServices/product-list']);
        this.openSnackBar('Added Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  updateProduct(productId: number, updatedData: any) {
    this.productService.UpdateProduct(productId, updatedData, this.selectedFile || undefined).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        this.router.navigate(['/admin/productsServices/product-list']);
        this.openSnackBar('Updated Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}