// This component represents the center pane of the application, which contains a form for user input,
// a scrollable table to display user information, and a list of submenus.

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';

interface User {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-center-pane',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatTableModule
  ],
  template: `
    <div class="center-container">
      <!-- MENU1: Form to enter user info -->
      <ng-container *ngIf="selectedMenu === 'menu1'">
        <mat-card class="user-form-card">
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" required />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" required />
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <input matInput formControlName="address" required />
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" required email />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phone" required />
              </mat-form-field>
            </div>
            <div class="form-actions">
              <button mat-flat-button color="primary" type="submit" [disabled]="userForm.invalid">Submit</button>
              <button mat-flat-button type="button" (click)="userForm.reset()">Cancel</button>
            </div>
          </form>
        </mat-card>
      </ng-container>

      <!-- MENU2: Scrollable table of user info -->
      <ng-container *ngIf="selectedMenu === 'menu2'">
        <div class="table-container">
          <table mat-table [dataSource]="userList$.value" class="mat-elevation-z1">
            <!-- Last Name Column -->
            <ng-container matColumnDef="lastName">
              <th mat-header-cell *matHeaderCellDef>Last Name</th>
              <td mat-cell *matCellDef="let user">{{ user.lastName }}</td>
            </ng-container>

            <!-- First Name Column -->
            <ng-container matColumnDef="firstName">
              <th mat-header-cell *matHeaderCellDef>First Name</th>
              <td mat-cell *matCellDef="let user">{{ user.firstName }}</td>
            </ng-container>

            <!-- Address Column -->
            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>Address</th>
              <td mat-cell *matCellDef="let user">{{ user.address }}</td>
            </ng-container>

            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{ user.email }}</td>
            </ng-container>

            <!-- Phone Column -->
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let user">{{ user.phone }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </ng-container>

      <!-- MENU3: List of submenus -->
      <ng-container *ngIf="selectedMenu === 'menu3'">
        <div class="submenu-list">
          <mat-nav-list>
            <mat-list-item *ngFor="let sub of submenus" (click)="onSubmenuClick(sub)">
              {{ sub }}
            </mat-list-item>
          </mat-nav-list>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .center-container {
      height: 100%;
      overflow-y: auto;
      padding: 16px;
    }
    .user-form-card {
      max-width: 600px;
      margin: 0 auto;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .full-width {
      flex: 1;
    }
    .form-actions {
      margin-top: 16px;
      display: flex;
      gap: 16px;
    }
    .table-container {
      max-height: 100%;
      overflow-y: auto;
    }
    table {
      width: 100%;
    }
    .submenu-list {
      max-width: 200px;
      margin: 0 auto;
    }
    mat-list-item {
      cursor: pointer;
    }
  `]
})
export class CenterPaneComponent {
  @Input() selectedMenu: string | null = null;
  
  @Input() userList$!: BehaviorSubject<User[]>;   // injected from AppComponent

  @Output() submenuSelected = new EventEmitter<string>();

  // New output to notify parent of the updated users list.
  @Output() userAdded = new EventEmitter<User[]>();

  userForm: FormGroup;

  /*
  // Default list of 3 users
  users: User[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      email: 'john@example.com',
      phone: '111-111-1111'
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
      address: '456 Second St',
      email: 'jane@example.com',
      phone: '222-222-2222'
    },
    {
      firstName: 'Alice',
      lastName: 'Cooper',
      address: '789 Third St',
      email: 'alice@example.com',
      phone: '333-333-3333'
    }
  ];
  */

  displayedColumns: string[] = ['lastName', 'firstName', 'address', 'email', 'phone'];
  submenus = ['submenu1', 'submenu2', 'submenu3'];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const newUser: User = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        address: this.userForm.value.address,
        email: this.userForm.value.email,
        phone: this.userForm.value.phone,
      };

      // Update shared BehaviorSubject
      const current = this.userList$.getValue();
      this.userList$.next([...current, newUser]);
      this.userForm.reset();

      // Add the new user to the local users array
      //this.users.push(newUser);    

      // Emit the updated users array so the parent can pass it to RightPaneComponent.
      //this.userAdded.emit(this.users);
    }
  }

  onSubmenuClick(sub: string) {
    this.submenuSelected.emit(sub);
  }
}
