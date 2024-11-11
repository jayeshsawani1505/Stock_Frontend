import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: any) {
        return throwError(error);
    }

    // Get all inventory items
    GetInventory(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/inventory`)
            .pipe(catchError(this.handleError));
    }

    // Add a new inventory item
    AddInventory(inventoryData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/inventory`, inventoryData)
            .pipe(catchError(this.handleError));
    }

    // Update an inventory item
    UpdateInventory(inventoryId: any, inventoryData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/inventory/${inventoryId}`, inventoryData)
            .pipe(catchError(this.handleError));
    }

    // Delete an inventory item
    DeleteInventory(inventoryId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/inventory/${inventoryId}`)
            .pipe(catchError(this.handleError));
    }

    // Upload Excel file to add multiple inventory items
    UploadExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient
            .post(environment.baseURL + `/inventory/upload-excel`, formData)
            .pipe(catchError(this.handleError));
    }

    // In-stock (Add quantity to inventory with notes)
    InStock(inventoryId: any, quantity: number, notes: string): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/inventory/in-stock/${inventoryId}`, { quantity, notes })
            .pipe(catchError(this.handleError));
    }

    // Out-stock (Remove quantity from inventory with notes)
    OutStock(inventoryId: any, quantity: number, notes: string): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/inventory/out-stock/${inventoryId}`, { quantity, notes })
            .pipe(catchError(this.handleError));
    }
}
