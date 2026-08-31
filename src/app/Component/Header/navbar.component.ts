import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

    menuOpen = false;

  activeDropdown: string | null = null;


  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;

    // Cerramos los dropdowns al cerrar el menú
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
