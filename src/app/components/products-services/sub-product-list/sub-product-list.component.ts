import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { ExcelService } from '../../../services/excel.service';
import { SubProductService } from '../../../services/subProduct.service';
import { DeleteProductComponent } from '../product-list/delete-product/delete-product.component';

@Component({
  selector: 'app-sub-product-list',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule
  ], templateUrl: './sub-product-list.component.html',
  styleUrl: './sub-product-list.component.css'
})
export class SubProductListComponent implements OnInit, AfterViewInit {
  productList: any[] = []; // Define productList to store product data
  productIdToDelete: number | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['index', 'subproduct_name', 'subproduct_code', 'product_name', 'units', 'quantity', 'selling_price', 'purchase_price', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private SubProductService: SubProductService,
    private ExcelService: ExcelService, public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.GetProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  // GetProducts method
  GetProducts() {
    this.SubProductService.GetSubProducts().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.subproducts) {
          this.productList = res.subproducts; // Assign products data to productList
          this.dataSource.data = this.productList;
        }
      },
      error: (err: any) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to the first page after applying the filter
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Check if input and input.files are not null
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.SubProductService.UploadExcel(file).subscribe(
        response => {
          this.GetProducts();
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

  editProduct(Product: any) {
    this.router.navigate(['/admin/productsServices/subProduct-edit', Product.subproduct_id], {
      state: { productData: Product } // Pass product data as state
    });
  }

  onDelete(productId: number) {
    const dialogRef = this.dialog.open(DeleteProductComponent, {
      data: productId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetProducts();
    });
  }

  excelDownload(title: string) {
    // Assuming productList contains the list of products
    let dataToExport = this.productList.map((x: any) => ({
      subproduct_id: x.subproduct_id,
      product_id: x.product_id,
      product_name: x.product_name,
      subproduct_name: x.subproduct_name,
      subproduct_code: x.subproduct_code,
      quantity: x.quantity,
      selling_price: x.selling_price,
      purchase_price: x.purchase_price,
      units: x.units,
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