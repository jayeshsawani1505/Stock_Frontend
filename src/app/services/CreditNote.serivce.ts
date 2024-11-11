import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class CreditNotesService {
    private baseURL = environment.baseURL + '/creditnoteinvoices';

    constructor(private httpClient: HttpClient) { }

    private handleServiceError(error: any): Observable<never> {
        return throwError(() => new Error(error.message || 'Server Error'));
    }

    // Fetch all credit notes
    fetchCreditNotes(): Observable<any> {
        return this.httpClient
            .get(`${this.baseURL}`)
            .pipe(catchError(this.handleServiceError));
    }

    // Create a new credit note
    createCreditNote(creditNoteData: any): Observable<any> {
        return this.httpClient
            .post(`${this.baseURL}`, creditNoteData)
            .pipe(catchError(this.handleServiceError));
    }

    // Modify an existing credit note
    modifyCreditNote(creditNoteId: number, creditNoteData: any): Observable<any> {
        return this.httpClient
            .put(`${this.baseURL}/${creditNoteId}`, creditNoteData)
            .pipe(catchError(this.handleServiceError));
    }

    // Remove a credit note
    removeCreditNote(creditNoteId: number): Observable<any> {
        return this.httpClient
            .delete(`${this.baseURL}/${creditNoteId}`)
            .pipe(catchError(this.handleServiceError));
    }

    // Upload Excel file for bulk credit note addition
    uploadCreditNoteExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient
            .post(`${this.baseURL}/upload-excel`, formData)
            .pipe(catchError(this.handleServiceError));
    }
}
