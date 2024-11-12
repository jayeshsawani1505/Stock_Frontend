import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ExcelService } from '../../../services/excel.service';
import { VendorService } from '../../../services/vendors.service';
import { DeleteVendorComponent } from './delete-vendor/delete-vendor.component';
import { VendorsAddEditComponent } from './vendors-add-edit/vendors-add-edit.component';

@Component({
  selector: 'app-vendors-list',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule
  ],
  providers: [VendorService],
  templateUrl: './vendors-list.component.html',
  styleUrl: './vendors-list.component.css'
})
export class VendorsListComponent implements OnInit, AfterViewInit {
  vendorList: any[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['index', 'name', 'phone', 'balance', 'created', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private VendorService: VendorService,
    private ExcelService: ExcelService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.GetVendors();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Fetch vendors
  GetVendors(): void {
    this.VendorService.GetVendors().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.vendors) {
          this.dataSource.data = res.vendors; // Assign vendors data to data source
          this.vendorList = res.vendors; // Assign the vendor data to vendorList
        }
      },
      error: (err: any) => {
        console.error('Error fetching vendors:', err);
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
      this.VendorService.UploadExcel(file).subscribe(
        response => {
          this.GetVendors();
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

  openAddvendor() {
    const dialogRef = this.dialog.open(VendorsAddEditComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetVendors();
    });
  }

  openEditvendor(data: any) {
    const dialogRef = this.dialog.open(VendorsAddEditComponent, {
      width: '550px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetVendors();
    });
  }

  // Delete the vendor by calling the service method
  DeleteVendor(vendorId: number): void {
    const dialogRef = this.dialog.open(DeleteVendorComponent, {
      data: vendorId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetVendors();
    });
  }

  // Excel Download
  excelDownload(title: string) {
    // Assuming vendorList contains the list of vendors
    let dataToExport = this.vendorList.map((x: any) => ({
      vendor_name: x.vendor_name,
      email: x.email,
      phone_number: x.phone_number,
      closing_balance: x.closing_balance,
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
