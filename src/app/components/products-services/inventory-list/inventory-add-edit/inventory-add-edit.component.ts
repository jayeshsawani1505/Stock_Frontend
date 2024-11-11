import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { InventoryService } from '../../../../services/inventory.service'; // Import your Inventory service

@Component({
  selector: 'app-inventory-add-edit',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule],
  providers: [InventoryService],
  templateUrl: './inventory-add-edit.component.html',
  styleUrls: ['./inventory-add-edit.component.css']
})
export class InventoryAddEditComponent implements OnInit {
  inventoryForm: FormGroup;

  constructor(
    private inventoryService: InventoryService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<InventoryAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.inventoryForm = this.fb.group({
      inventory_id: [''],
      item_name: ['', [Validators.required]],
      item_code: ['', [Validators.required]],
      units: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      selling_price: ['', [Validators.required]],
      purchase_price: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.data?.inventory_id) {
      this.fetchData(this.data);  // Pre-fill form data if editing
    }
  }

  fetchData(inventory: any) {
    this.inventoryForm.patchValue({
      inventory_id: inventory.inventory_id,
      item_name: inventory.item_name,
      item_code: inventory.item_code,
      units: inventory.units,
      quantity: inventory.quantity,
      selling_price: inventory.selling_price,
      purchase_price: inventory.purchase_price,
      status: inventory.status
    });
  }

  addInventory() {
    if (this.inventoryForm.invalid) {
      return;
    }
    const inventoryData = this.inventoryForm.value;
    this.inventoryService.AddInventory(inventoryData).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Inventory added successfully:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  editInventory() {
    if (this.inventoryForm.invalid) {
      return;
    }
    const inventoryData = this.inventoryForm.value;
    this.inventoryService.UpdateInventory(inventoryData.inventory_id, inventoryData).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Inventory updated successfully:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
