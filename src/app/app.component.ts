// This component serves as the main application layout, containing a top pane, left pane, center pane, right pane, and bottom pane.
// It uses Angular's component architecture to organize the layout and functionality of the application.

import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeDirective } from './resize.directive';
import { TopPaneComponent } from './top-pane/top-pane.component';
import { LeftPaneComponent } from './left-pane/left-pane.component';
import { CenterPaneComponent } from './center-pane/center-pane.component';
import { RightPaneComponent } from './right-pane/right-pane.component';
import { BottomPaneComponent } from './bottom-pane/bottom-pane.component';
import { BehaviorSubject } from 'rxjs';

interface User {
  firstName: string;
  lastName:  string;
  address:   string;
  email:     string;
  phone:     string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ResizeDirective,
    TopPaneComponent,
    LeftPaneComponent,
    CenterPaneComponent,
    RightPaneComponent,
    BottomPaneComponent
  ],
  template: `
    <div class="app-container">
      <!-- Top Pane -->
      <div class="pane top-pane">
        <app-top-pane
          [username]="username"
          [rightVisible]="rightVisible()"
          (logout)="onLogout()"
          (settings)="onSettings()"
          (toggleRight)="toggleRightPane()"
        ></app-top-pane>
      </div>

      <!-- Middle Row -->
      <div class="pane middle-row">
        <!-- LEFT PANE -->
        <div class="pane-section left-pane" #leftPane>
          <app-left-pane
            [menus]="menus"
            [selectedMenu]="selectedMenu()"
            (selectedMenuChange)="onMenuSelect($event)"
          ></app-left-pane>
        </div>

        <!-- SPLITTER: left ↔ center -->
        <div
          class="splitter"
          appResize
          [prev]="$any(leftPane)"
          [next]="$any(centerPane)"
        ></div>

        <!-- CENTER PANE -->
        <div class="pane-section center-pane" #centerPane [ngClass]="{'full-width': !rightVisible()}">
          <app-center-pane
            [selectedMenu]="selectedMenu()"
            [userList$]="userList$"
            (submenuSelected)="onSubmenuSelected($event)"
          ></app-center-pane>
        </div>

        <div class="pane-section right-pane" #rightPane [hidden]="!rightVisible()" style="order:2">
          <app-right-pane
            [visible]="rightVisible()"
            [newTabLabel$]="newTabLabel$"
            [userList$]="userList$"
          ></app-right-pane>
        </div>

        <div
          class="splitter"
          appResize
          [prev]="$any(centerPane)"
          [next]="$any(rightPane)"
          [hidden]="!rightVisible()"
          style="order:1">
        </div>
      </div>

      <!-- Bottom Pane -->
      <div class="pane bottom-pane">
        <app-bottom-pane></app-bottom-pane>
      </div>
    </div>
  `,
  styles: [
    `
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .pane { flex-shrink: 0; }
    .top-pane {
      height: 56px;
      background-color: #3F51B5;
      color: #fff;
    }
    .bottom-pane {
      height: 40px;
      background-color: #B0BEC5;
    }
    .middle-row {
      flex: 1;
      display: flex;
      flex-direction: row;
      overflow: hidden;
    }
    .pane-section {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .left-pane {
      flex: 0 0 200px;
      min-width: 120px;
      max-width: 400px;
      background-color: #F5F5F5;
      border-right: 1px solid #ccc;
    }
    .center-pane {
      flex: 1 1 auto;
      min-width: 200px;
      background-color: #FFFFFF;
      border-right: 1px solid #ccc;
    }
    .center-pane.full-width {
      border-right: none;
    }
    .right-pane {
      flex: 1 1 auto;
      min-width: 200px;
      border-left: 1px solid #ccc;
    }
    .splitter {
      width: 4px;
      background-color: #ddd;
      cursor: col-resize;
      z-index: 10;
    }
    .splitter:hover {
      background-color: #bbb;
    }
    `
  ]
})
export class AppComponent {
  username = 'user name here';
  menus = ['menu1', 'menu2', 'menu3'];
  selectedMenu = signal<string | null>(null);
  private _rightVisible = signal<boolean>(true);
  rightVisible = this._rightVisible.asReadonly();

  userList$ = new BehaviorSubject<User[]>([
    { firstName: 'Alice', lastName: 'Anderson', address: '123 Maple St', email: 'alice.anderson@example.com', phone: '555-1000' },
    { firstName: 'Bob', lastName: 'Bennet', address: '456 Oak Ave', email: 'bob.bennet@example.com', phone: '555-2000' },
    { firstName: 'Carol', lastName: 'Chen', address: '789 Pine Rd', email: 'carol.chen@example.com', phone: '555-3000' }
  ]);

  newTabLabel$ = new BehaviorSubject<string | null>(null);

  // Get a reference to the center pane element.
  @ViewChild('centerPane', { static: true }) centerPane!: ElementRef;

  onMenuSelect(menu: string) {
    this.selectedMenu.set(menu);
  }

  onSubmenuSelected(submenu: string) {
    this.newTabLabel$.next(submenu);
  }

  toggleRightPane() {
  // Toggle right pane visibility.
  this._rightVisible.update(v => !v);
  // If the right pane is collapsed, reset inline styles on the center pane
  if (!this._rightVisible()) {
    // Remove any inline width/flex settings left by the resize directive.
    this.centerPane.nativeElement.style.width = '';
    this.centerPane.nativeElement.style.flexBasis = '';
    // Reset the entire inline style
    this.centerPane.nativeElement.removeAttribute('style');
  }
  }

  onLogout() { console.log('Logout clicked'); }
  onSettings() { console.log('Settings clicked'); }
}
