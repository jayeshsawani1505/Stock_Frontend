import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import moment from 'moment';
import { ExcelService } from '../../../services/excel.service';
import { PaymentService } from '../../../services/payments.service';
import { CustomerService } from '../../../services/Customer.service';

@Component({
  selector: 'app-payment-summary',
  standalone: true,
  imports: [CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule, MatSnackBarModule,
    ReactiveFormsModule, FormsModule, MatInputModule,
    MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatSelectModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './payment-summary.component.html',
  styleUrl: './payment-summary.component.css'
})
export class PaymentSummaryComponent implements OnInit, AfterViewInit {
  range: FormGroup;
  paymentsList: any[] = [];
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['index', 'payment_id', 'customer_name', 'amount', 'payment_mode', 'payment_date', 'payment_status', 'created_at'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  filters = {};
  customerList: any[] = [];

  constructor(
    private PaymentService: PaymentService,
    private CustomerService: CustomerService,
    private ExcelService: ExcelService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog, private fb: FormBuilder) {
    this.range = this.fb.group({
      start: [null],
      end: [null],
      customer_id: [null],
    });
  }

  ngOnInit(): void {
    this.GetCustomers();
    this.GetPayments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!; // Assign paginator to data source after view initialization
  }
  GetCustomers() {
    this.CustomerService.GetCustomers().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.customers) {
          this.customerList = res.customers; // Assign customers data to customerList
        }
      },
    });
  }
  GetPayments(): void {
    const filters = this.filters || {}; // Default to an empty object if no filters provided

    this.PaymentService.getFilteredPayments(filters).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.paymentsList = res.data; // Assign the Payment data to paymentsList
          this.dataSource.data = this.paymentsList; // Assign the data to MatTableDataSource
        }
      },
      error: (err: any) => {
        console.error('Error fetching categories:', err);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  // Apply filter to search
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to the first page after applying the filter
    }
  }


  getFormattedDateRange(): string {
    const start = this.range.value.start
      ? moment(this.range.value.start).format('YYYY-MM-DD')
      : '';
    const end = this.range.value.end
      ? moment(this.range.value.end).format('YYYY-MM-DD')
      : '';
    return `${start} to ${end}`;
  }

  applyDateFilter() {
    const start = this.range.value.start
      ? moment(this.range.value.start).format('YYYY-MM-DD')
      : null;
    const end = this.range.value.end
      ? moment(this.range.value.end).format('YYYY-MM-DD')
      : null;
    const customer_id = this.range.value.customer_id
    if (start && end || customer_id) {
      this.filters = {
        startDate: start,
        endDate: end,
        customerId: customer_id
      };
      this.GetPayments();
    }
  }
  FilterReset() {
    this.range.reset();
    this.filters = {};
    this.GetPayments();
  }

  excelDownload(title: string) {
    // Assuming categoryList contains the list of categories
    let dataToExport = this.paymentsList.map((x: any) => ({
      payment_id: x.payment_id,
      customer_name: x.customer_name,
      amount: x.amount,
      payment_mode: x.payment_mode || 'N/A', // Provide default value if payment_mode is empty
      payment_date: x.payment_date,
      payment_status: x.payment_status,
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}
