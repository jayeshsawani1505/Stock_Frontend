import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { PurchaseService } from '../../../../services/purchases.service';

@Component({
  selector: 'app-change-purchase-status',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule,
    FormsModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './change-purchase-status.component.html',
  styleUrl: './change-purchase-status.component.css'
})
export class ChangePurchaseStatusComponent {
  stockForm: FormGroup;
  statusData: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePurchaseStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private PurchaseService: PurchaseService,
    private snackBar: MatSnackBar
  ) {
    console.log(data);

    this.statusData = data;

    // Initialize form with data, if any
    this.stockForm = this.fb.group({
      purchase_id: [this.statusData?.id || '', Validators.required],
      status: [this.statusData?.status || '', [Validators.required,]],
    });
  }

  onSubmit() {
    const status = this.stockForm.value.status;

    this.PurchaseService.ChangePurchaseStatus(this.statusData.id, { status }).subscribe({
      next: (response) => {
        this.onCancel();
        console.log('Status changed successfully:', response);
        this.openSnackBar('Status Changed Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error changing invoice status:', error);
        this.openSnackBar('Error changing status', 'Close');
      }
    });
  }

  onCancel(): void {
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

