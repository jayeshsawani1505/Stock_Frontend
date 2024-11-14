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
  imageUrl: string | ArrayBuffer | null = null;
  fileName: string = '';
  selectedFile: File | null = null;

  constructor(private categoryService: CategoryService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CategoryAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) {

    this.categoryForm = this.fb.group({
      category_name: ['', [Validators.required]],
      category_id: [''],
      description: [''],
      category_photo: ['']
    });
  }

  ngOnInit(): void {
    if (this.data?.category_id) {
      this.fetchData(this.data)
    }
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
    const formData = new FormData();
    // Append form fields to FormData
    formData.append('category_name', this.categoryForm.get('category_name')?.value);
    formData.append('description', this.categoryForm.get('description')?.value);

    // Append the selected file if available
    if (this.selectedFile) {
      formData.append('category_photo', this.selectedFile, this.selectedFile.name);
    }
    this.categoryService.AddCategory(formData).subscribe({
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
    const formData = new FormData();
    // Append form fields to FormData
    formData.append('category_name', this.categoryForm.get('category_name')?.value);
    formData.append('description', this.categoryForm.get('description')?.value);

    // Append the selected file if available
    if (this.selectedFile) {
      formData.append('category_photo', this.selectedFile, this.selectedFile.name);
    }
    this.categoryService.UpdateCategory(this.categoryForm.value.category_id, formData).subscribe({
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
