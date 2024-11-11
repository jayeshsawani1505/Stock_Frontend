import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { InventoryAddEditComponent } from './inventory-add-edit/inventory-add-edit.component';
import { InOutStockComponent } from './in-out-stock/in-out-stock.component';
import { ExcelService } from '../../../services/excel.service';
import { DeleteInventoryComponent } from './delete-inventory/delete-inventory.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule],
  providers: [InventoryService],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.css'
})
export class InventoryListComponent implements OnInit {
  inventoryList: any[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  dataForExcel: any[] = [];

  constructor(private InventoryService: InventoryService,
    private ExcelService: ExcelService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.Getinventorys();
  }

  // Fetch inventorys
  Getinventorys(): void {
    this.InventoryService.GetInventory().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.inventoryList = res.data; // Assign the inventory data to inventoryList
        }
      },
      error: (err: any) => {
        console.error('Error fetching inventorys:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Check if input and input.files are not null
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.InventoryService.UploadExcel(file).subscribe(
        response => {
          this.Getinventorys();
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

  openAddinventory() {
    const dialogRef = this.dialog.open(InventoryAddEditComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Getinventorys();
    });
  }

  openEditinventory(data: any) {
    const dialogRef = this.dialog.open(InventoryAddEditComponent, {
      width: '550px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Getinventorys();
    });
  }

  openStockDialog(isAddMode: boolean, data: any): void {
    const dialogRef = this.dialog.open(InOutStockComponent, {
      width: '550px',
      data: {
        isAddMode,
        stockData: data
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Getinventorys();
    });
  }


  // Open delete confirmation with the selected inventory's ID
  openDeleteinventory(inventoryId: number): void {
    const dialogRef = this.dialog.open(DeleteInventoryComponent, {
      data: inventoryId,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Getinventorys();
    });
  }

  excelDownload(title: string) {
    // Assuming inventoryList contains the list of inventory items
    let dataToExport = this.inventoryList.map((x: any) => ({
      item_name: x.item_name,
      item_code: x.item_code,
      units: x.units,
      quantity: x.quantity,
      selling_price: x.selling_price,
      purchase_price: x.purchase_price,
      status: x.status,
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
