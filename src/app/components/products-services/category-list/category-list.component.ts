import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/Category.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryAddEditComponent } from './category-add-edit/category-add-edit.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule],
  providers: [CategoryService],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  categoryList: any[] = [];

  constructor(private categoryService: CategoryService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.GetCategories();
  }

  // Fetch categories
  GetCategories(): void {
    this.categoryService.GetCategories().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.categoryList = res.data; // Assign the category data to categoryList
        }
      },
      error: (err: any) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  // Open the edit modal with the selected category
  openAddCategory() {
    const dialogRef = this.dialog.open(CategoryAddEditComponent, {
      width: '550px', // Adjust width as needed
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetCategories();
      // Handle any actions after the dialog closes
    });
  }

  openEditCategory(data: any) {
    const dialogRef = this.dialog.open(CategoryAddEditComponent, {
      width: '550px', // Adjust width as needed
      data: data // Pass any data if required
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetCategories();
      // Handle any actions after the dialog closes
    });
  }


  // Open delete confirmation with the selected category's ID
  openDeleteCategory(categoryId: number): void {
    const confirmation = window.confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      this.deleteCategory(categoryId);
    }
  }

  // Delete the category by calling the service method
  deleteCategory(categoryId: number): void {
    this.categoryService.DeleteCategory(categoryId).subscribe({
      next: (response) => {
        console.log('Category deleted successfully:', response);
        // Optionally, refresh the category list after deletion
        this.GetCategories();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
      }
    });
  }
}
