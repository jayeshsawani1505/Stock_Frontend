import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login', pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./account/account-routing.module').then(m => m.AccountRoutingModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('./components/components-routing.module').then(m => m.AdminRoutingModule)
    },
];
