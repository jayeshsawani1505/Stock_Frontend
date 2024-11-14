import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

    constructor(private router: Router) { }

    activeMenu: string | null = null;
    openSubmenu: string | null = null;

    toggleMenu(menu: string): void {
        if (this.activeMenu === menu) {
            this.activeMenu = null;
        } else {
            this.activeMenu = menu;
            this.openSubmenu = null; // Close any open submenu
        }
    }

    isActive(menu: string): boolean {
        return this.activeMenu === menu;
    }
    logout() {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
    }
}
