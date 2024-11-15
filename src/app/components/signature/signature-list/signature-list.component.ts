import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SignatureService } from '../../../services/signature.srvice';
import { AddEditSignatureComponent } from './add-edit-signature/add-edit-signature.component';
import { DeleteSignatureComponent } from './delete-signature/delete-signature.component';

@Component({
  selector: 'app-signature-list',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule,
    MatPaginatorModule, MatTableModule
  ],
  templateUrl: './signature-list.component.html',
  styleUrl: './signature-list.component.css'
})
export class SignatureListComponent implements OnInit, AfterViewInit {
  signatureList: any[] = [];
  displayedColumns: string[] = ['index', 'signature_name', 'signature_photo', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private SignatureService: SignatureService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.GetSignatures();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  // Fetch signatures
  GetSignatures(): void {
    this.SignatureService.GetSignatures().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.signatures) {
          this.dataSource.data = res.signatures; // Assign signatures data to data source
          this.signatureList = res.signatures; // Assign the signatures data to signatureList
        }
      },
      error: (err: any) => {
        console.error('Error fetching signatures:', err);
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

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/user-signature.png';
  }
  openAddSignature() {
    const dialogRef = this.dialog.open(AddEditSignatureComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetSignatures();
    });
  }

  openEditSignature(data: any) {
    const dialogRef = this.dialog.open(AddEditSignatureComponent, {
      width: '550px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetSignatures();
    });
  }

  // Delete the Signature by calling the service method
  DeleteSignature(signature_id: number): void {
    const dialogRef = this.dialog.open(DeleteSignatureComponent, {
      data: signature_id,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetSignatures();
    });
  }
}
