import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate() {
        const currentUser = this.authenticationService.currentUserValue.authdata;
        if (currentUser) {
            return true;
        }
        else {
            this.router.navigate(['/auth/login']);
            return false;
        }
    }
}