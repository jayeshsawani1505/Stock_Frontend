import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/products.service';

@Component({
  selector: 'app-in-out-stock-product',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule],
  templateUrl: './in-out-stock-product.component.html',
  styleUrl: './in-out-stock-product.component.css'
})
export class InOutStockProductComponent {
  stockForm: FormGroup;
  isAddMode: boolean;
  stockData: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InOutStockProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ProductService: ProductService
  ) {
    this.isAddMode = data.isAddMode;
    this.stockData = data.stockData;

    // Initialize form with data, if any
    this.stockForm = this.fb.group({
      name: [this.stockData?.product_name || '', Validators.required],
      quantity: [0, [Validators.required,]],
    });
  }

  onSubmit() {
    if (this.stockForm.valid) {
      const { quantity } = this.stockForm.value;
      const product_id = this.stockData?.product_id; // Assuming `stockData` has an `id` field

      // Select API call based on isAddMode
      const stockObservable = this.isAddMode
        ? this.ProductService.InStock(product_id, quantity)
        : this.ProductService.OutStock(product_id, quantity);

      stockObservable.subscribe({
        next: (response) => {
          console.log(this.isAddMode ? 'Stock added successfully:' : 'Stock removed successfully:', response);
          this.dialogRef.close(true); // Close dialog on success
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

