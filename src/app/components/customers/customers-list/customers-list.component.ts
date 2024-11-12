import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../services/Customer.service';
import { ExcelService } from '../../../services/excel.service';
import { DeleteCustomerComponent } from './delete-customer/delete-customer.component';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule
  ],
  providers: [CustomerService],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.css'
})
export class CustomersListComponent implements OnInit, AfterViewInit {
  customerList: any[] = [];
  customerIdToDelete: number | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['index', 'name', 'phone', 'balance', 'totalInvoice', 'created', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private CustomerService: CustomerService,
    private ExcelService: ExcelService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.GetCustomers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Attach paginator after view initialization
  }

  // GetCustomers method
  GetCustomers() {
    this.CustomerService.GetCustomers().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.customers) {
          this.dataSource.data = res.customers;
          this.customerList = res.customers;
        }
      },
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
      this.CustomerService.UploadExcel(file).subscribe(
        response => {
          this.GetCustomers();
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

  editCustomer(customer: any) {
    this.router.navigate(['/admin/customers/customers-edit', customer.customer_id], {
      state: { customerData: customer } // Pass customer data as state
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/profiles/avatar-14.jpg';
  }

  // Store the customer ID to be deleted
  openDeleteConfirmation(customerId: number): void {
    const dialogRef = this.dialog.open(DeleteCustomerComponent, {
      data: customerId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetCustomers();
    });
  }

  // Excel Download
  excelDownload(title: string) {
    let dataToExport = this.customerList.map((x: any) => ({
      profile_photo: x.profile_photo,
      name: x.name,
      currency: x.currency,
      email: x.email,
      website: x.website,
      phone: x.phone,
      notes: x.notes,
      billing_name: x.billing_name,
      billing_address_line1: x.billing_address_line1,
      billing_address_line2: x.billing_address_line2,
      billing_country: x.billing_country,
      billing_state: x.billing_state,
      billing_city: x.billing_city,
      billing_pincode: x.billing_pincode,
      shipping_name: x.shipping_name,
      shipping_address_line1: x.shipping_address_line1,
      shipping_address_line2: x.shipping_address_line2,
      shipping_country: x.shipping_country,
      shipping_state: x.shipping_state,
      shipping_city: x.shipping_city,
      shipping_pincode: x.shipping_pincode,
      bank_name: x.bank_name,
      branch: x.branch,
      account_number: x.account_number,
      account_holder_name: x.account_holder_name,
      ifsc: x.ifsc,
      created_at: x.created_at,
    }));

    // Prepare the data to export by converting each row to its values
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