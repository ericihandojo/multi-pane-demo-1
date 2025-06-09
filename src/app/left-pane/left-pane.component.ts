// This component represents the left pane of the application, displaying a list of menu items.

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-left-pane',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule
  ],
  template: `
    <div class="left-container">
      <mat-nav-list>
        <mat-list-item 
          *ngFor="let menu of menus" 
          (click)="selectMenu(menu)" 
          [class.selected]="menu === selectedMenu">
          {{ menu }}
        </mat-list-item>
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .left-container {
      height: 100%;
      overflow-y: auto;
    }
    mat-list-item {
      cursor: pointer;
    }
    .selected {
      background-color: #e0e0e0;
    }
  `]
})
export class LeftPaneComponent {
  /** List of menu item strings (e.g. ['menu1','menu2','menu3']) */
  @Input() menus: string[] = ['menu1','menu2','menu3'];

  /** Currently selected menu */
  @Input() selectedMenu: string | null = null;
  @Output() selectedMenuChange = new EventEmitter<string>();

  selectMenu(menu: string) {
    if (menu !== this.selectedMenu) {
      this.selectedMenu = menu;
      this.selectedMenuChange.emit(menu);
    }
  }
}
