import { Component, Inject } from '@angular/core';
import { CategoryService } from '../../../../services/Category.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [],
  templateUrl: './delete-category.component.html',
  styleUrl: './delete-category.component.css'
})
export class DeleteCategoryComponent {
  constructor(private CategoryService: CategoryService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteCategory(): void {
    this.CategoryService.DeleteCategory(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Category deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting Category:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
