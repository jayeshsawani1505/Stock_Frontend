import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { ExpensesService } from '../../../services/Expenses.service';
import { ExcelService } from '../../../services/excel.service';
import { AddEditExpensesComponent } from './add-edit-expenses/add-edit-expenses.component';
import { DeleteExpensesComponent } from './delete-expenses/delete-expenses.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit, AfterViewInit {
  ExpensesList: any[] = [];
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['index', 'reference', 'amount', 'payment_mode', 'expense_date', 'payment_status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private ExpensesService: ExpensesService,
    private ExcelService: ExcelService,
    public dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.GetExpenses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  // Fetch expenses
  GetExpenses(): void {
    this.ExpensesService.GetExpenses().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.dataSource.data = res.data; // Assign Expensess data to data source
          this.ExpensesList = res.data; // Assign the Expenses data to ExpensesList
        }
      },
      error: (err: any) => {
        console.error('Error fetching Expensess:', err);
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

  openAddExpenses() {
    const dialogRef = this.dialog.open(AddEditExpensesComponent, {
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetExpenses();
    });
  }

  openEditExpenses(data: any) {
    this.router.navigate(['/admin/finance-account/expenses-edit', data.expense_id], {
      state: { ExpensesData: data } // Pass customer data as state
    });
  }

  // Delete the Expenses by calling the service method
  DeleteExpenses(ExpensesId: number): void {
    const dialogRef = this.dialog.open(DeleteExpensesComponent, {
      data: ExpensesId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetExpenses();
    });
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

}
