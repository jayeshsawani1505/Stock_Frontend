import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { ExcelService } from '../../../services/excel.service';
import { QuotationService } from '../../../services/quotation.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import moment from 'moment';
import { CustomerService } from '../../../services/Customer.service';
import * as pdfMake from 'pdfmake/build/pdfmake';

@Component({
  selector: 'app-quotation-report',
  standalone: true,
  imports: [CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule, MatSnackBarModule,
    ReactiveFormsModule, FormsModule, MatInputModule,
    MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatSelectModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './quotation-report.component.html',
  styleUrl: './quotation-report.component.css'
})
export class QuotationReportComponent implements OnInit {
  range: FormGroup;
  quotationsList: any[] = []; // Define quotationsList to store invoice data
  dataForExcel: any[] = [];
  displayedColumns: string[] = [
    'id',
    'quotation_number',
    'customer_id',
    'total_amount',
    'due_date',
    'status',
    'created_at'
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  filters = {};
  customerList: any[] = [];

  constructor(
    private QuotationService: QuotationService,
    private CustomerService: CustomerService,
    private ExcelService: ExcelService,
    public dialog: MatDialog, private snackBar: MatSnackBar,
    private router: Router, private fb: FormBuilder) {
    this.range = this.fb.group({
      start: [null],
      end: [null],
      customer_id: [null],
    });
  }

  ngOnInit(): void {
    this.GetCustomers();
    this.getQuotations();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
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

  getQuotations() {
    const filters = this.filters || {}; // Default to an empty object if no filters provided

    this.QuotationService.getFilteredQuotations(filters).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.quotationsList = res.data; // Assign invoice data to quotationsList
          this.dataSource.data = this.quotationsList;
        }
      },
      error: (err: any) => {
        console.error('Error fetching invoices:', err);
        this.openSnackBar('error', 'Close');
      }
    });
  }

  // Apply the filter for invoice search
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
      this.getQuotations();
    }
  }
  FilterReset() {
    this.range.reset();
    this.filters = {};
    this.getQuotations();
  }

  excelDownload(title: string) {
    // Assuming quotationsList contains the list of invoices
    let dataToExport = this.quotationsList.map((x: any) => ({
      quotation_number: x.quotation_number,
      customer_name: x.customer_name || 'N/A',
      customer_phone: x.customer_phone || 'N/A',
      quotation_date: new Date(x.quotation_date).toLocaleDateString(),
      due_date: new Date(x.due_date).toLocaleDateString(),
      product_name: x.product_id,
      quantity: x.quantity || 0,
      unit: x.unit || 'N/A',
      rate: x.rate || 0,
      total_amount: x.total_amount || 0,
      notes: x.notes || 'N/A',
      terms_conditions: x.terms_conditions || 'N/A',
      created_at: new Date(x.created_at).toLocaleDateString(),
      category_name: x.category_name || 'N/A',
    }));


    // Prepare the data to export by converting each row to its values
    this.dataForExcel = []; // Clear previous data
    dataToExport.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row));
    });

    console.log(this.dataForExcel);

    // Extract header names dynamically from the keys of the first object
    let headers = Object.keys(dataToExport[0]);

    // Define the report data with headers and data
    let reportData = {
      data: this.dataForExcel,
      headers: headers, // Use keys as headers
      title: title
    };

    // Call the Excel service to generate the excel file
    this.ExcelService.generateExcel(reportData);

    // Clear data after export
    this.dataForExcel = [];
  }
  async generatePDF() {
    const docDefinition: any = {
      content: [
        {
          columns: [
            [
              { text: 'PEC Trading Pvt Ltd', fontSize: 16, bold: true, color: '#4e50d3', margin: [0, 0, 0, 10] },
            ],
            [
              { text: 'QUOTATION REPORT', fontSize: 24, bold: true, alignment: 'right', color: '#4e50d3' },
            ],
          ],
        },
        { text: 'Customer Information', style: 'sectionHeader' },
        { text: `Customer Name: ${this.quotationsList[0].customer_name}`, margin: [0, 10] },
        { text: `Customer Phone: ${this.quotationsList[0].customer_phone}`, margin: [0, 0, 0, 10] },
        {
          style: 'tableExample',
          table: {
            widths: [50, 120, 100, 100, 100],
            body: [
              // Header row
              [
                { text: '#', bold: true, alignment: 'center', style: 'tableHeader' },
                { text: 'Quotation #', bold: true, alignment: 'center', style: 'tableHeader' },
                { text: 'Status', bold: true, alignment: 'center', style: 'tableHeader' },
                { text: 'Quotation Date', bold: true, alignment: 'center', style: 'tableHeader' },
                { text: 'Total Amount', bold: true, alignment: 'center', style: 'tableHeader' },
              ],
              // Dynamically add rows for quotations
              ...this.quotationsList.map((item, index) => [
                { text: index + 1, alignment: 'center', style: 'tableCell' },
                { text: item.quotation_number, alignment: 'center', style: 'tableCell' },
                { text: item.status, alignment: 'center', style: 'tableCell' },
                { text: formatDate(item.quotation_date), alignment: 'center', style: 'tableCell' },
                { text: item.total_amount, alignment: 'center', style: 'tableCell' },
              ]),
            ],
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0 ? null : rowIndex % 2 === 0 ? '#F7F7F7' : null;
            },
          },
        },
      ],
      styles: {
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        tableExample: { margin: [0, 5, 0, 15], fontSize: 10 },
        tableHeader: { bold: true, fontSize: 12, color: 'white', fillColor: '#B0B0B0', alignment: 'center' },
        tableCell: { margin: [2, 2, 2, 2] },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}

function formatDate(date: moment.MomentInput) {
  return date ? moment(date).format('DD/MM/YYYY') : null;
}