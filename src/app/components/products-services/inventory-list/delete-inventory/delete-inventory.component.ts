import { Component, Inject } from '@angular/core';
import { InventoryService } from '../../../../services/inventory.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-inventory',
  standalone: true,
  imports: [],
  templateUrl: './delete-inventory.component.html',
  styleUrl: './delete-inventory.component.css'
})
export class DeleteInventoryComponent {
  constructor(private InventoryService: InventoryService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteInventory(): void {
    this.InventoryService.DeleteInventory(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Inventory deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting Inventory:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
