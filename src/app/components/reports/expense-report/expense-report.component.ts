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
import { ExpensesService } from '../../../services/Expenses.service';

@Component({
  selector: 'app-expense-report',
  standalone: true,
  imports: [CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule, MatSnackBarModule,
    ReactiveFormsModule, FormsModule, MatInputModule,
    MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatSelectModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './expense-report.component.html',
  styleUrl: './expense-report.component.css'
})
export class ExpenseReportComponent implements OnInit, AfterViewInit {
  range: FormGroup;
  ExpensesList: any[] = [];
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['index', 'reference', 'amount', 'payment_mode', 'expense_date', 'payment_status'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  filters = {};

  constructor(
    private ExpensesService: ExpensesService,
    private ExcelService: ExcelService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
    this.range = this.fb.group({
      start: [null],
      end: [null],
      customer_id: [null],
    });
  }

  ngOnInit(): void {
    this.GetExpenses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  // Fetch expenses
  GetExpenses(): void {
    const filters = this.filters || {}; // Default to an empty object if no filters provided

    this.ExpensesService.getFilteredExpenses(filters).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.dataSource.data = res.data; // Assign Expensess data to data source
          this.ExpensesList = res.data; // Assign the Expenses data to ExpensesList
        }
      },
      error: (err: any) => {
        console.error('Error fetching Expensess:', err);
        this.openSnackBar('error', 'Close');
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
    if (start && end) {
      this.filters = {
        startDate: start,
        endDate: end,
      };
      this.GetExpenses();
    }
  }
  FilterReset() {
    this.range.reset();
    this.filters = {};
    this.GetExpenses();
  }
  // Excel Download
  excelDownload(title: string) {
    // Assuming ExpensesList contains the list of Expensess
    let dataToExport = this.ExpensesList.map((x: any) => ({
      Reference: x.reference,
      Amount: x.amount,
      Payment_Mode: x.payment_mode,
      Expense_Date: x.expense_date,
      Payment_Status: x.payment_status,
      Description: x.description,
      Created_At: x.created_at,
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

