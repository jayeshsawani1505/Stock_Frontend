import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { ExcelService } from '../../../services/excel.service';
import { QuotationService } from '../../../services/quotation.service';
import { DeleteQuatationComponent } from './delete-quatation/delete-quatation.component';

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule, MatSnackBarModule
  ],
  templateUrl: './quotations.component.html',
  styleUrl: './quotations.component.css'
})
export class QuotationsComponent implements OnInit {
  quotationsList: any[] = []; // Define quotationsList to store invoice data
  dataForExcel: any[] = [];
  displayedColumns: string[] = [
    'id',
    'quotation_number',
    'customer_id',
    'total_amount',
    'due_date',
    'status',
    'created_at',
    'actions'
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private QuotationService: QuotationService,
    private ExcelService: ExcelService,
    public dialog: MatDialog, private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.getQuotations();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  getQuotations() {
    this.QuotationService.getQuotations().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.quotations) {
          this.quotationsList = res.quotations; // Assign invoice data to quotationsList
          this.dataSource.data = this.quotationsList;
        }
      },
      error: (err: any) => {
        console.error('Error fetching invoices:', err);
        this.openSnackBar('error', 'Close');
      }
    });
  }
  getQuotationsForPDF(invoiceId: number) {
    this.QuotationService.getQuotationsForPDF(invoiceId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.generatePDF(res.data)
      },
      error: (err: any) => {
        console.error('Error fetching invoices:', err);
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

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/profiles/avatar-14.jpg';
  }

  // Edit invoice
  editInvoice(invoice: any) {
    this.router.navigate(['/admin/quotations/quotations-edit/', invoice.id], {
      state: { QuotationData: invoice } // Pass invoice data as state
    });
  }

  // Store the invoice ID to be deleted
  openDeleteConfirmation(invoiceId: number): void {
    const dialogRef = this.dialog.open(DeleteQuatationComponent, {
      data: invoiceId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getQuotations();
    });
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
  async generatePDF(data: any) {
    const invoiceDetails = data.invoice_details
      ? JSON.parse(data.invoice_details) // Parse the stringified JSON safely
      : [];

    // Helper function to format currency


    let docDefinition: any = {
      content: [
        {
          columns: [
            [
              {
                text: data.company_name || 'PEC Trading Pvt Ltd', // Dynamic Company Name
                fontSize: 16,
                bold: true,
                color: '#4e50d3',
                margin: [0, 0, 0, 10],
              },
            ],
            [
              {
                text: 'Quotation',
                fontSize: 24,
                bold: true,
                alignment: 'right',
                color: '#4e50d3',
              },
              {
                text: `Quotation No: ${data.quotation_number}\nQuotation Date: ${formatDate(data.quotation_date) || 'Not Available'
                  }\nDue Date: ${formatDate(data.due_date) || 'Not Available'}`,
                fontSize: 10,
                alignment: 'right',
                margin: [0, 10, 0, 0],
              },
            ],
          ],
        },
        { text: 'Customer Information', style: 'sectionHeader', margin: [0, 20, 0, 10] },
        {
          columns: [
            [
              { text: 'Customer Details:', bold: true },
              { text: data.name || 'Not Available' },
              {
                text: `Payment Status: ${data.status || 'Unknown'}`,
                color: data.status === 'paid' ? 'green' : 'red',
              },
            ],
            [
              { text: 'Billing Address:', bold: true },
              {
                text: `${data.billing_name || ''}\n${data.billing_address_line1 || ''}, ${data.billing_address_line2 || ''
                  },\n${data.billing_city || ''}, ${data.billing_state || ''}, ${data.billing_country || ''
                  } - ${data.billing_pincode || ''}`,
              },
            ],
          ],
        },
        { text: ' ', margin: [0, 10] },
        {
          style: 'tableExample',
          table: {
            widths: [20, 250, 80, 40, 40, 40, 60],
            body: [
              [
                { text: '#', bold: true, alignment: 'center' },
                { text: 'Item', bold: true, alignment: 'center' },
                { text: 'Qty', bold: true, alignment: 'center' },
                { text: 'Unit', bold: true, alignment: 'center' },
                { text: 'Rate', bold: true, alignment: 'center' },
                { text: 'Amount', bold: true, alignment: 'center' },
              ],
              ...invoiceDetails.map((item: any, index: number) => [
                { text: index + 1, alignment: 'center' },
                { text: `${item.category_name} - ${item.product_name}`, alignment: 'center' },
                { text: item.quantity || 0, alignment: 'center' },
                { text: item.unit || 'N/A', alignment: 'center' },
                { text: item.rate || 0, alignment: 'center' },
                { text: item.subtotal_amount || 0, alignment: 'center' },
              ]),
            ],
          },
        },
        {
          columns: [

            {
              width: '100%',
              table: {
                widths: ['*', 'auto'],
                body: [
                  [
                    { text: 'Subtotal:', alignment: 'right', bold: true },
                    { text: data.subtotal_amount || 0, alignment: 'right', bold: true },
                  ],
                  ...(data.adjustmentValue
                    ? [
                      [
                        { text: `${data.adjustmentType || 'Adjustment'}:`, alignment: 'right', bold: true },
                        { text: data.adjustmentValue, alignment: 'right', bold: true },
                      ],
                    ]
                    : []),
                  ...(data.adjustmentValue2
                    ? [
                      [
                        { text: `${data.adjustmentType2 || 'Adjustment'}:`, alignment: 'right', bold: true },
                        { text: data.adjustmentValue2, alignment: 'right', bold: true },
                      ],
                    ]
                    : []),
                  [
                    { text: 'Grand Total:', alignment: 'right', bold: true },
                    { text: data.total_amount || 0, alignment: 'right', bold: true },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          columns: [
            [
              { text: 'Terms & Conditions:', bold: true },
              { text: data.terms_conditions || 'Not Available' },
            ],
          ],
          margin: [0, 20, 0, 0],
        },
        {
          text: 'Thanks for your Business',
          alignment: 'center',
          margin: [0, 20, 0, 0],
          fontSize: 12,
          bold: true,
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
      },
    };

    pdfMake.createPdf(docDefinition).open();
    // Uncomment to trigger download
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