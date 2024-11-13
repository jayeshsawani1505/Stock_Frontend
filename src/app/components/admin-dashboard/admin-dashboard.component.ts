import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { CommonService } from '../../services/common.service';
import { CustomerService } from '../../services/Customer.service';
import { InvoiceService } from '../../services/invoice.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgxChartsModule, RouterModule, MatTableModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  invoiceList: any[] = [];
  totalCustomers: any;
  totalInvoice: any;
  productChartData: any[] = [];
  invoiceStatusData: any[] = [];
  productColorScheme: Color;
  invoiceColorScheme: Color;
  displayedColumns: string[] = ['invoice_number', 'category_name', 'customer_name'];
  dataSource = new MatTableDataSource<any>();
  
  constructor(
    private CustomerService: CustomerService,
    private InvoiceService: InvoiceService,
    private CommonService: CommonService,
  ) {
    // Product chart color scheme
    this.productColorScheme = {
      name: 'category10',  // 'viridis' is a professional color palette with a perceptually uniform color scale
      selectable: true,
      group: ScaleType.Ordinal,
      domain: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']  // Category10 color palette
    };

    // Professional color scheme for Invoice chart
    this.invoiceColorScheme = {
      name: 'paired',  // 'paired' is another perceptually uniform color palette
      selectable: true,
      group: ScaleType.Ordinal,
      domain: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']  // Paired color palette
    };
  }

  ngOnInit(): void {
    this.GetCustomersCount();
    this.GetInvoiceCount();
    this.GetProductChartData();
    this.getInvoiceStatusData();
    this.GetInvoices();
  }

  GetCustomersCount() {
    this.CustomerService.GetCustomersCount().subscribe({
      next: (res: any) => {
        this.totalCustomers = res.totalCustomers;
        console.log(res);
      }
    })
  }

  GetInvoiceCount() {
    this.InvoiceService.GetInvoiceCount().subscribe({
      next: (res: any) => {
        this.totalInvoice = res.totalInvoice;
        console.log(res);
      }
    })
  }

  // Fetch product chart data
  GetProductChartData() {
    this.CommonService.getProductChartData().subscribe({
      next: (res: any) => {
        this.productChartData = res.map((item: any) => ({
          name: item.label,
          value: item.value
        }));
      }
    });
  }

  // Fetch invoice status data
  getInvoiceStatusData() {
    this.CommonService.getInvoiceStatusWise().subscribe({
      next: (res: any) => {
        this.invoiceStatusData = res.map((item: any) => ({
          name: item.status,
          value: item.invoice_count
        }));
      }
    });
  }

  GetInvoices() {
    this.InvoiceService.GetInvoices().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.invoiceList = res.data.slice(0, 5); // Get only the first 5 items
          this.dataSource.data = this.invoiceList;
        }
      },
    });
  }
}
