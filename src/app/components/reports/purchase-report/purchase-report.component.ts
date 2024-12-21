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
import * as pdfMake from 'pdfmake/build/pdfmake';
import { ExcelService } from '../../../services/excel.service';
import { PurchasePaymentsService } from '../../../services/PurchasePayment.service';
import { VendorService } from '../../../services/vendors.service';

@Component({
  selector: 'app-purchase-report',
  standalone: true,
  imports: [CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule, MatSnackBarModule,
    ReactiveFormsModule, FormsModule, MatInputModule,
    MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatSelectModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './purchase-report.component.html',
  styleUrl: './purchase-report.component.css'
})
export class PurchaseReportComponent implements OnInit, AfterViewInit {
  range: FormGroup;
  PurchaseList: any[] = []; // Define PurchaseList to store Purchase data
  PurchaseIdToDelete: number | null = null;
  dataForExcel: any[] = [];
  displayedColumns: string[] = ['log_id', 'vendor_name', 'transaction_type', 'amount', 'balance_after', 'created_at'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  filters = {};
  vendorList: any[] = [];

  constructor(private PurchasePaymentsService: PurchasePaymentsService,
    private ExcelService: ExcelService,
    private VendorService: VendorService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
    this.range = this.fb.group({
      start: [null],
      end: [null],
      vendor_id: [null],
    });
  }

  ngOnInit(): void {
    this.GetVendors();
    this.getPurchases();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  // Fetch vendors
  GetVendors(): void {
    this.VendorService.GetVendors().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.vendors) {
          this.vendorList = res.vendors;
        }
      },
    });
  }
  // Fetch Purchase data
  getPurchases(): void {
    const filters = this.filters || {}; // Default to an empty object if no filters provided

    this.PurchasePaymentsService.getFilteredTransactionLogs(filters).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          console.log(res);
          this.PurchaseList = res.data;
          this.dataSource.data = this.PurchaseList;
        }
      },
      error: (err) => {
        console.error('Error fetching Purchases:', err);
        this.openSnackBar('error', 'Close');
      }
    });
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
    const vendor_id = this.range.value.vendor_id
    if (start && end || vendor_id) {
      this.filters = {
        startDate: start,
        endDate: end,
        vendorId: vendor_id
      };
      this.getPurchases();
    }
  }
  FilterReset() {
    this.range.reset();
    this.filters = {};
    this.getPurchases();
  }

  excelDownload(title: string) {
    // Assuming purchaseList contains the list of purchase records
    let dataToExport = this.PurchaseList.map((x: any) => ({
      vendor_id: x.vendor_id,
      purchase_date: x.purchase_date,
      due_date: x.due_date,
      reference_no: x.reference_no,
      supplier_invoice_serial_no: x.supplier_invoice_serial_no,
      product_id: x.product_id,
      quantity: x.quantity,
      unit: x.unit,
      rate: x.rate,
      notes: x.notes,
      terms_conditions: x.terms_conditions,
      total_amount: x.total_amount,
      signature_image: x.signature_image,
      created_at: x.created_at,
      payment_mode: x.payment_mode,
      status: x.status,
      vendor_name: x.vendor_name
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

  async generatePDF() {
    // Calculate totals for amount and balance_after
    const totalAmount = this.PurchaseList
      .filter(item => item.transaction_type === 'payment-in') // Filter by transaction type
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0); // Sum the amounts
    const finalBalance = this.PurchaseList.length > 0 ? this.PurchaseList[this.PurchaseList.length - 1].balance_after : 0;

    let docDefinition: any = {
      content: [
        {
          columns: [
            [
              {
                text: 'PEC Trading Pvt Ltd',
                fontSize: 16,
                bold: true,
                color: '#4e50d3',
                margin: [0, 0, 0, 10],
              },
            ],
            [
              {
                text: 'VENDOR STATEMENT',
                fontSize: 24,
                bold: true,
                alignment: 'right',
                color: '#4e50d3',
              },
            ],
          ],
        },
        { text: 'Vendor Information', style: 'sectionHeader' },
        { text: `Vendor Name: ${this.PurchaseList[0].vendor_name}`, margin: [0, 10] },
        {
          style: 'tableExample',
          table: {
            widths: [50, 100, 110, 110, 110, 110, 110],

            body: [
              // Header row
              [
                { text: '#', bold: true, alignment: 'center', style: 'tableHeader' },
                { text: 'Transaction Type', bold: true, alignment: 'center', style: 'tableHeader' },
                { text: 'Amount', bold: true, alignment: 'center', style: 'tableHeader' },
                { text: 'Payable Balance', bold: true, alignment: 'center', style: 'tableHeader' },
                { text: 'Date', bold: true, alignment: 'center', style: 'tableHeader' },
              ],
              // Dynamically add rows from paymentsList
              ...this.PurchaseList.map((item, index) => [
                { text: index + 1, alignment: 'center', style: 'tableCell' },
                { text: item.transaction_type, alignment: 'center', style: 'tableCell' },
                { text: item.amount, alignment: 'center', style: 'tableCell' },
                { text: item.balance_after, alignment: 'center', style: 'tableCell' },
                { text: formatDate(item.payment_date), alignment: 'center', style: 'tableCell' },
              ]),
            ],
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0 ? null : rowIndex % 2 === 0 ? '#F7F7F7' : null; // Alternate row colors
            },
          },
        },
        {
          text: `Total Receive Amount: ${totalAmount}`,
          margin: [0, 5], alignment: 'right'
        },
        {
          text: `Total Pending Balance: ${finalBalance}`,
          margin: [0, 5], alignment: 'right'
        },
      ],
      styles: {
        sectionHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
          fontSize: 10,
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'white',
          fillColor: '#B0B0B0', // Gray background for header
          alignment: 'center',
        },
        tableCell: {
          margin: [2, 2, 2, 2],
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
    // pdfMake.createPdf(docDefinition).download('Invoice.pdf');
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