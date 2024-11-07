import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../../services/Category.service';

@Component({
  selector: 'app-category-add-edit',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule],
  providers: [CategoryService],
  templateUrl: './category-add-edit.component.html',
  styleUrl: './category-add-edit.component.css'
})
export class CategoryAddEditComponent implements OnInit {
  categoryForm: FormGroup;

  constructor(private categoryService: CategoryService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CategoryAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) {

    this.categoryForm = this.fb.group({
      category_name: ['', [Validators.required]],
      category_id: [''],
      description: [''],
      image: ['']
    });
  }

  ngOnInit(): void {
    if (this.data?.category_id){
      this.fetchData(this.data)
    }
  }
  
  fetchData(category: any) {
    this.categoryForm.patchValue({
      category_id: category.category_id,
      category_name: category.category_name,
      description: category.description
    });
  }

  addCategory() {
    if (this.categoryForm.invalid) {
      return;
    }
    const categoryData = this.categoryForm.value;
    this.categoryService.AddCategory(categoryData).subscribe({
      next: (response) => {
        this.onClose();
        console.log('category added successfully:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  editCategory() {
    if (this.categoryForm.invalid) {
      return;
    }
    const categoryData = this.categoryForm.value;
    this.categoryService.UpdateCategory(categoryData.category_id, categoryData).subscribe({
      next: (response) => {
        this.onClose();
        console.log('category update successfully:', response);
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
