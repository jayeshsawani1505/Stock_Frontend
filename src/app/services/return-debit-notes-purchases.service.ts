import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ReturnDebitNotesPurchaseService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: any) {
        return throwError(error);
    }

    // Get all Stock Replace for purchases
    getReturnDebitNotesPurchases(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/return-debit-notes-purchases`)
            .pipe(catchError(this.handleError));
    }

    // Add a new return debit note for a purchase
    addReturnDebitNotePurchase(debitNoteData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/return-debit-notes-purchases`, debitNoteData)
            .pipe(catchError(this.handleError));
    }

    // Update a return debit note for a purchase
    updateReturnDebitNotePurchase(debitNoteId: any, debitNoteData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/return-debit-notes-purchases/${debitNoteId}`, debitNoteData)
            .pipe(catchError(this.handleError));
    }

    // Delete a return debit note for a purchase
    deleteReturnDebitNotePurchase(debitNoteId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/return-debit-notes-purchases/${debitNoteId}`)
            .pipe(catchError(this.handleError));
    }

    // Upload Excel file to add multiple Stock Replace for purchases
    uploadExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient
            .post(environment.baseURL + `/return-debit-notes-purchases/upload-excel`, formData)
            .pipe(catchError(this.handleError));
    }
}
