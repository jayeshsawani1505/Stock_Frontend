import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: any) {
        return throwError(error);
    }

    // Get all purchases
    getPurchases(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/purchases`)
            .pipe(catchError(this.handleError));
    }

    // Add a new purchase
    addPurchase(purchaseData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/purchases`, purchaseData)
            .pipe(catchError(this.handleError));
    }

    // Update a purchase
    updatePurchase(purchaseId: any, purchaseData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/purchases/${purchaseId}`, purchaseData)
            .pipe(catchError(this.handleError));
    }

    // Delete a purchase
    deletePurchase(purchaseId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/purchases/${purchaseId}`)
            .pipe(catchError(this.handleError));
    }

    // Upload Excel file to add multiple purchases
    uploadExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient
            .post(environment.baseURL + `/purchases/upload-excel`, formData)
            .pipe(catchError(this.handleError));
    }
}