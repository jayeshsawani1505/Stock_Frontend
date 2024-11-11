import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/Category.service';
import { ExcelService } from '../../../services/excel.service';
import { CategoryAddEditComponent } from './category-add-edit/category-add-edit.component';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';

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
  @ViewChild('fileInput') fileInput!: ElementRef;
  dataForExcel: any[] = [];

  constructor(private categoryService: CategoryService,
    private ExcelService: ExcelService,
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
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Check if input and input.files are not null
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.categoryService.UploadExcel(file).subscribe(
        response => {
          this.GetCategories();
          console.log('File uploaded successfully', response);
        },
        error => {
          console.error('File upload failed', error);
        }
      );
    } else {
      console.error('No file selected');
    }
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
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      data: categoryId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetCategories();
    });
  }

  excelDownload(title: string) {
    // Assuming categoryList contains the list of categories
    let dataToExport = this.categoryList.map((x: any) => ({
      category_id: x.category_id,
      category_name: x.category_name,
      description: x.description,
      created_at: x.created_at,
    }));

    // Prepare the data to export by converting each row to its values
    this.dataForExcel = []; // Make sure to clear previous data
    dataToExport.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row));
    });

    console.log(this.dataForExcel);

    // Extract the header names dynamically from the keys of the first object
    let headers = Object.keys(dataToExport[0]);

    // Define the report data with the headers and corresponding data
    let reportData = {
      data: this.dataForExcel,
      headers: headers, // Dynamically use the keys as headers
      title: title
    };

    // Call the Excel service to generate the excel file
    this.ExcelService.generateExcel(reportData);

    // Clear the data after exporting
    this.dataForExcel = [];
  }

}
