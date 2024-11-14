import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { SignatureService } from '../../../../services/signature.srvice';

@Component({
  selector: 'app-add-edit-signature',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule,
    FormsModule, MatDialogModule, MatCheckboxModule],
  templateUrl: './add-edit-signature.component.html',
  styleUrl: './add-edit-signature.component.css'
})
export class AddEditSignatureComponent implements OnInit {
  signatureForm: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  fileName: string = '';
  selectedFile: File | null = null;

  constructor(private SignatureService: SignatureService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditSignatureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) {

    this.signatureForm = this.fb.group({
      signature_name: ['', [Validators.required]],
      signature_id: [''],
      status: [''],
      signature_photo: ['']
    });
  }

  ngOnInit(): void {
    if (this.data?.signature_id) {
      this.fetchData(this.data)
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.isFileSizeValid(file)) {
        this.previewFile(file);
      } else {
        this.removeImage();
      }
    }
  }

  private isFileSizeValid(file: File): boolean {
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert 2 MB to bytes
    const isValid = file.size <= maxSizeInBytes;

    if (!isValid) {
      alert('File size exceeds 2 MB. Please select a smaller file.');
    }

    return isValid;
  }

  private previewFile(file: File): void {
    this.fileName = file.name;
    this.selectedFile = file;

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imageUrl = null;
    this.fileName = '';
    this.selectedFile = null;
  }

  fetchData(signature: any) {
    this.signatureForm.patchValue({
      signature_id: signature.signature_id,
      signature_name: signature.signature_name,
      signature_photo: signature.signature_photo,
      status: signature.status
    });
  }

  addSignature() {
    if (this.signatureForm.invalid) {
      return;
    }
    const formData = new FormData();
    // Append form fields to FormData
    formData.append('signature_name', this.signatureForm.get('signature_name')?.value);
    formData.append('status', this.signatureForm.get('status')?.value);

    // Append the selected file if available
    if (this.selectedFile) {
      formData.append('signature_photo', this.selectedFile, this.selectedFile.name);
    }
    this.SignatureService.AddSignature(formData).subscribe({
      next: (response) => {
        this.onClose();
        console.log('Signature added successfully:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  editSignature() {
    if (this.signatureForm.invalid) {
      return;
    }
    const formData = new FormData();
    // Append form fields to FormData
    formData.append('signature_name', this.signatureForm.get('signature_name')?.value);
    formData.append('status', this.signatureForm.get('status')?.value);

    // Append the selected file if available
    if (this.selectedFile) {
      formData.append('signature_photo', this.selectedFile, this.selectedFile.name);
    }
    this.SignatureService.UpdateSignature(this.signatureForm.value.signature_id, formData).subscribe({
      next: (response) => {
        this.onClose();
        console.log('signature update successfully:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
