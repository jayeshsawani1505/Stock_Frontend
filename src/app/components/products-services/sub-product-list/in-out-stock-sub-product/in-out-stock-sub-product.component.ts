import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { SubProductService } from '../../../../services/subProduct.service';

@Component({
  selector: 'app-in-out-stock-sub-product',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule],
  templateUrl: './in-out-stock-sub-product.component.html',
  styleUrl: './in-out-stock-sub-product.component.css'
})
export class InOutStockSubProductComponent {
  stockForm: FormGroup;
  isAddMode: boolean;
  stockData: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InOutStockSubProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private SubProductService: SubProductService
  ) {
    this.isAddMode = data.isAddMode;
    this.stockData = data.stockData;

    // Initialize form with data, if any
    this.stockForm = this.fb.group({
      name: [this.stockData?.subproduct_name || '', Validators.required],
      quantity: [0, [Validators.required,]],
    });
  }

  onSubmit() {
    if (this.stockForm.valid) {
      const { quantity } = this.stockForm.value;
      const subproduct_id = this.stockData?.subproduct_id; // Assuming `stockData` has an `id` field

      // Select API call based on isAddMode
      const stockObservable = this.isAddMode
        ? this.SubProductService.InStock(subproduct_id, quantity)
        : this.SubProductService.OutStock(subproduct_id, quantity);

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


