import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all products
    GetProducts(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/products`)
            .pipe(catchError(this.handleError));
    }

    // Add a new product
    // AddProduct(productData: any): Observable<any> {
    //     return this.httpClient
    //         .post(environment.baseURL + `/products`, productData)
    //         .pipe(catchError(this.handleError));
    // }
    AddProduct(productData: any, file?: File): Observable<any> {
        const formData = new FormData();

        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });

        if (file) {
            formData.append('product_image', file);
        }

        return this.httpClient
            .post(`${environment.baseURL}/products`, formData)
            .pipe(catchError(this.handleError));
    }

    // Update a product
    UpdateProduct(productId: any, productData: any, file?: File): Observable<any> {
        const formData = new FormData();

        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });

        if (file) {
            formData.append('product_image', file);
        }

        return this.httpClient
            .put(`${environment.baseURL}/products/${productId}`, formData)
            .pipe(catchError(this.handleError));
    }

    // Delete a product
    DeleteProduct(productId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/products/${productId}`)
            .pipe(catchError(this.handleError));
    }

    // Upload Excel file to add multiple customers
    UploadExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient
            .post(environment.baseURL + `/products/upload-excel`, formData)
            .pipe(catchError(this.handleError));
    }
}
