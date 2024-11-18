import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ExpensesService } from '../../../../services/Expenses.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit-expenses',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule,
    RouterModule, MatSnackBarModule],
  templateUrl: './add-edit-expenses.component.html',
  styleUrl: './add-edit-expenses.component.css'
})
export class AddEditExpensesComponent implements OnInit {
  expenseForm!: FormGroup;
  ExpensesData: any;
  imageUrl: string | ArrayBuffer | null = null;
  fileName: string = '';
  selectedFile: File | null = null;
  imgURL = environment.ImageUrl
  isAddMode: boolean = true;

  constructor(private fb: FormBuilder,
    private ExpensesService: ExpensesService,
    private router: Router, private snackBar: MatSnackBar,
  ) {
    this.expenseForm = this.fb.group({
      reference: ['', [Validators.required]],
      amount: [, [Validators.required, Validators.min(0.01)]],
      payment_mode: ['', [Validators.required]],
      expense_date: ['', [Validators.required]],
      payment_status: ['', [Validators.required]],
      description: [''],
      attachment: []
    });
  }

  ngOnInit(): void {
    this.fetchExpensesData();
  }

  fetchExpensesData() {
    // Get Expenses data from history state (if available)
    this.ExpensesData = history.state.ExpensesData;
    console.log(this.ExpensesData);

    if (this.ExpensesData) {
      this.isAddMode = false;
      // Populate the form with the Expenses data
      this.populateForm(this.ExpensesData);
    }
  }
  // If fetching from the state is successful, populate the form
  populateForm(data: any) {
    this.expenseForm.patchValue({
      reference: data.reference || '',
      amount: data.amount || null,
      payment_mode: data.payment_mode || '',
      expense_date: data.expense_date ? new Date(data.expense_date) : '',
      payment_status: data.payment_status || '',
      description: data.description || '',
      attachment: data.attachment || null
    });
    this.imageUrl = this.imgURL + data.attachment,
      this.selectedFile = data.attachment
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.isFileSizeValid(file)) {
        this.previewFile(file);
      } else {
        this.removeImage();
      }
    }
  }

  private isFileSizeValid(file: File): boolean {
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert 2 MB to bytes
    const isValid = file.size <= maxSizeInBytes;

    if (!isValid) {
      alert('File size exceeds 2 MB. Please select a smaller file.');
    }

    return isValid;
  }

  private previewFile(file: File): void {
    this.fileName = file.name;
    this.selectedFile = file;

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imageUrl = null;
    this.fileName = '';
    this.selectedFile = null;
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      // Check if history state has Expenses data for update
      const ExpensesData = history.state.ExpensesData;

      if (ExpensesData) {
        // If Expenses data exists in state, update the Expenses
        this.UpdateExpenses(ExpensesData.expense_id, this.expenseForm.value);
      } else {
        // Otherwise, add a new Expenses
        this.AddExpenses(this.expenseForm.value);
      }
    }
  }

  AddExpenses(ExpensesData: any) {
    this.ExpensesService.AddExpenses(ExpensesData, this.selectedFile || undefined).subscribe({
      next: (response) => {
        console.log('Expenses added successfully:', response);
        this.router.navigate(['/admin/finance-account/expenses']);
        this.openSnackBar('Add Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error adding Expenses:', error);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  UpdateExpenses(expense_id: number, updatedData: any) {
    this.ExpensesService.UpdateExpenses(expense_id, updatedData, this.selectedFile || undefined).subscribe({
      next: (response) => {
        console.log('Expenses updated successfully:', response);
        this.router.navigate(['/admin/finance-account/expenses']);
        this.openSnackBar('Update Successfully', 'Close');
      },
      error: (error) => {
        console.error('Error updating Expenses:', error);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  onClose(): void {
    this.expenseForm.reset()
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}