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
    background-color:rgb(202, 215, 238);  /* Dark blue-gray */
  }
  mat-list-item {
    cursor: pointer;
    color: #FFFFFF;             /* White text for clarity */
    padding: 10px 16px;
  }
  .selected {
    background-color:rgb(228, 233, 241);  /* Lighter blue-gray for selected state */
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
