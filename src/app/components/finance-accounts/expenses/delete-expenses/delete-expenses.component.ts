import { Component, Inject } from '@angular/core';
import { ExpensesService } from '../../../../services/Expenses.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-expenses',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-expenses.component.html',
  styleUrl: './delete-expenses.component.css'
})
export class DeleteExpensesComponent {
  constructor(private ExpensesService: ExpensesService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  // Call the delete API when deletion is confirmed
  DeleteExpenses(): void {
    this.ExpensesService.DeleteExpenses(this.data).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Expenses deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting Expenses:', error);
      }
    });
  }
  onClose(): void {
    this.dialogRef.close();
  }
}
