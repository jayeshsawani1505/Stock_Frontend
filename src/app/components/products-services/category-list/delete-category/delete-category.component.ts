import { Component, Inject } from '@angular/core';
import { CategoryService } from '../../../../services/Category.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [MatSnackBarModule],
  templateUrl: './delete-category.component.html',
  styleUrl: './delete-category.component.css'
})
export class DeleteCategoryComponent {
  constructor(private CategoryService: CategoryService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteCategoryComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  deleteCategory(): void {
    this.CategoryService.DeleteCategory(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Category deleted successfully:', response);
        this.openSnackBar('Delete Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting Category:', error);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}
