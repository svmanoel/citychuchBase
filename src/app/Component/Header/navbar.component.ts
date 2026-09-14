import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  menuOpen = false;

  activeDropdown: string | null = null;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;

    // Close dropdowns when closing the menu
    if (!this.menuOpen) {
      this.activeDropdown = null;
    }
  }

  toggleDropdown(menu: string): void {

    if (this.activeDropdown === menu) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = menu;
    }

  }

  closeMenu(): void {
    this.menuOpen = false;
    this.activeDropdown = null;
  }
}