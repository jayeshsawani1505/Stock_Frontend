import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../../../services/inventory.service';

@Component({
  selector: 'app-in-out-stock',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule],
  providers: [InventoryService],
  templateUrl: './in-out-stock.component.html',
  styleUrl: './in-out-stock.component.css'
})
export class InOutStockComponent {
  stockForm: FormGroup;
  isAddMode: boolean;
  stockData: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InOutStockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private InventoryService: InventoryService
  ) {
    this.isAddMode = data.isAddMode;
    this.stockData = data.stockData;

    // Initialize form with data, if any
    this.stockForm = this.fb.group({
      name: [this.stockData?.item_name || '', Validators.required],
      quantity: [0, [Validators.required,]],
      // units: [this.stockData?.units || '', Validators.required],
      notes: [this.stockData?.notes || ''],
    });
  }

  onSubmit() {
    if (this.stockForm.valid) {
      const { quantity, notes } = this.stockForm.value;
      const inventoryId = this.stockData?.inventory_id; // Assuming `stockData` has an `id` field

      // Select API call based on isAddMode
      const stockObservable = this.isAddMode
        ? this.InventoryService.InStock(inventoryId, quantity, notes)
        : this.InventoryService.OutStock(inventoryId, quantity, notes);

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
