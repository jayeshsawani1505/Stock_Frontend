import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class VendorService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: any) {
        return throwError(error);
    }

    // Get all vendors
    GetVendors(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/vendors`)
            .pipe(catchError(this.handleError));
    }

    // Add a new vendor
    AddVendor(vendorData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/vendors`, vendorData)
            .pipe(catchError(this.handleError));
    }

    // Update a vendor
    UpdateVendor(vendorId: any, vendorData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/vendors/${vendorId}`, vendorData)
            .pipe(catchError(this.handleError));
    }

    // Delete a vendor
    DeleteVendor(vendorId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/vendors/${vendorId}`)
            .pipe(catchError(this.handleError));
    }
    
    // Upload Excel file to add multiple vendors
    UploadExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient
            .post(environment.baseURL + `/vendors/upload-excel`, formData)
            .pipe(catchError(this.handleError));
    }
}
