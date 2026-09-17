import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {

    // Stores the section currently expanded
  activeSection: string | null = null;

  // Show or hide a section
  toggleSection(section: string): void {

    if (this.activeSection === section) {
      this.activeSection = null;
    } else {
      this.activeSection = section;
    }

  }

}
