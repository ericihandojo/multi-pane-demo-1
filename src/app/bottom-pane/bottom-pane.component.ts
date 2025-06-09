// This component represents the bottom pane of the application, which displays a footer with copyright information.
// It is a simple component that does not require any complex logic or data binding.
// It is used to provide a consistent footer across the application, enhancing the user interface and user experience.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottom-pane',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bottom-container">
      <span>© 2025 My Company. All rights reserved.</span>
    </div>
  `,
  styles: [`
    .bottom-container {
      height: 40px;
      background-color: #f1f1f1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
  `]
})
export class BottomPaneComponent {}
