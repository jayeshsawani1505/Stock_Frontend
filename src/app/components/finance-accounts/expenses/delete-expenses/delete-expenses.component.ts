import { Component, Inject } from '@angular/core';
import { ExpensesService } from '../../../../services/Expenses.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-expenses',
  standalone: true,
  imports: [MatDialogModule, MatSnackBarModule],
  templateUrl: './delete-expenses.component.html',
  styleUrl: './delete-expenses.component.css'
})
export class DeleteExpensesComponent {
  constructor(private ExpensesService: ExpensesService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteExpensesComponent>, private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  DeleteExpenses(): void {
    this.ExpensesService.DeleteExpenses(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Expenses deleted successfully:', response);
        this.openSnackBar('Delete Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error deleting Expenses:', error);
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
