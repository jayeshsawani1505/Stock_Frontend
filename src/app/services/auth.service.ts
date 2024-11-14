import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {
        // Check if the code is running in the browser
        const currentUserData = isPlatformBrowser(this.platformId) ? localStorage.getItem('currentUser') : null;
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(currentUserData || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    private handleError(error: HttpErrorResponse) {
        return throwError(() => new Error(error.message));
    }

    /**
     * Logs in a user and stores the user data in local storage.
     */
    userLogin(data: any): Observable<any> {
        return this.http.post<any>(`${environment.baseURL}/auth/login`, data)
            .pipe(
                map(response => {
                    if (response.message === "Login successful" && response.Data?.token) {
                        // Store the token in the local storage only in the browser
                        if (isPlatformBrowser(this.platformId)) {
                            const user = {
                                ...response.Data,
                                authdata: response.Data.token
                            };
                            localStorage.setItem('currentUser', JSON.stringify(user));

                            // Update the current user subject
                            this.currentUserSubject.next(user);
                        }

                        return response.Data;
                    } else {
                        throw new Error("Login response does not contain the required data");
                    }
                })
            );
    }
}
