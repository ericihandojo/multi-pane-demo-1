// This file defines the TopPaneComponent which is a part of the Angular application.
// It includes a toolbar with an app icon, title, username, and buttons for logout, settings, and toggling the right pane visibility.

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-top-pane',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <mat-toolbar class="top-toolbar">
      <!-- Left: App Icon -->
      <div class="left-area">
        <img src="assets/app-icon.png" alt="" class="app-icon" />
        <span class="app-title">Multipane Demo 1</span>
      </div>

      <!-- Right: Username, Logout, Settings, Collapse/Expand -->
      <div class="right-area">
        <span class="username">{{ username }}</span>
        <button mat-icon-button 
                (click)="logout.emit()" 
                matTooltip="Logout"
                matTooltipPosition="below">
          <mat-icon>logout</mat-icon>
        </button>
        <button mat-icon-button 
                (click)="settings.emit()"
                matTooltip="Settings"
                matTooltipPosition="below">
          <mat-icon>settings</mat-icon>
        </button>
        <button mat-icon-button 
                (click)="toggleRight.emit()"
                [matTooltip]="rightVisible ? 'Collapse Right Pane' : 'Expand Right Pane'"
                matTooltipPosition="below">
          <mat-icon>{{ rightVisible ? 'chevron_right' : 'chevron_left' }}</mat-icon>
        </button>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .top-toolbar {
      display: flex;
      justify-content: space-between;
      background-color:rgb(222, 228, 238) !important;
    }
    .left-area {
      display: flex;
      align-items: center;
    }
    .app-icon {
      height: 32px;
      width: 32px;
      object-fit: contain;
      margin: 0 6px;
      vertical-align: middle;
    }
    .app-title {
      font-size: 20px;
      font-weight: 500;
    }
    .right-area {
      display: flex;
      align-items: center;
    }
    .username {
      margin-right: 16px;
      font-size: 16px;
    }
  `]
})
export class TopPaneComponent {
  /** Username to display on the right */
  @Input() username: string = 'User';
  /** Whether the right pane is currently visible */
  @Input() rightVisible: boolean = true;

  /** Emits when user clicks “logout” */
  @Output() logout = new EventEmitter<void>();

  /** Emits when user clicks “settings” */
  @Output() settings = new EventEmitter<void>();

  /** Emits when user toggles show/hide right pane */
  @Output() toggleRight = new EventEmitter<void>();
}

