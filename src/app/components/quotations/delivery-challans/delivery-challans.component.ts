import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { QuotationService } from '../../../services/quotation.service';
import { ExcelService } from '../../../services/excel.service';
import { DeleteChallanComponent } from './delete-challan/delete-challan.component';

@Component({
  selector: 'app-delivery-challans',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule
  ],
  templateUrl: './delivery-challans.component.html',
  styleUrl: './delivery-challans.component.css'
})
export class DeliveryChallansComponent implements OnInit {
  quotationsList: any[] = []; // Define quotationsList to store invoice data
  dataForExcel: any[] = [];
  displayedColumns: string[] = [
    'delivery_number',
    'category_name',
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
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.getDeliveryChallans();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  getDeliveryChallans() {
    this.QuotationService.getDeliveryChallans().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.quotationsList = res.data; // Assign invoice data to quotationsList
          this.dataSource.data = this.quotationsList;
        }
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
    this.router.navigate(['/admin/quotations/delivery-challans-edit/', invoice.id], {
      state: { QuotationData: invoice } // Pass invoice data as state
    });
  }

  // Store the invoice ID to be deleted
  openDeleteConfirmation(invoiceId: number): void {
    const dialogRef = this.dialog.open(DeleteChallanComponent, {
      data: invoiceId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDeliveryChallans();
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

}
