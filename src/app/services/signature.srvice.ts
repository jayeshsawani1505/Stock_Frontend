import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class SignatureService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all signatures
    GetSignatures(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/signatures`)
            .pipe(catchError(this.handleError));
    }

    // Add a new signature
    AddSignature(signatureData: FormData): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/signatures`, signatureData)
            .pipe(catchError(this.handleError));
    }

    // Update a signature
    UpdateSignature(signatureId: string | number, signatureData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/signatures/${signatureId}`, signatureData)
            .pipe(catchError(this.handleError));
    }

    // Delete a signature
    DeleteSignature(signatureId: string | number): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/signatures/${signatureId}`)
            .pipe(catchError(this.handleError));
    }

    // Get a single signature by ID
    GetSignatureById(signatureId: string | number): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/signatures/${signatureId}`)
            .pipe(catchError(this.handleError));
    }
}
