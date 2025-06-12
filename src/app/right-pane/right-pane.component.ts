// This component represents the right pane of the application, which displays tabs with user information in a tree structure.
// It allows users to open multiple tabs, each showing details of a user in a nested tree format.
// It also provides functionality to close tabs and manage the visibility of the right pane.

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Subscription } from 'rxjs';

interface User {
  firstName: string;
  lastName:  string;
  address:   string;
  email:     string;
  phone:     string;
}

/** Tree node for hierarchical data */
interface TreeNode {
  name: string;
  children?: TreeNode[];
}

/** Flat node with expandable and level information */
interface FlatNode {
  name: string;
  level: number;
  expandable: boolean;
}

/** Tab model including its tree control and data source */
interface Tab {
  label: string;
  color: string;
  treeControl: FlatTreeControl<FlatNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, FlatNode>;
}

@Component({
  selector: 'app-right-pane',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTreeModule
  ],
  template: `
    <div class="right-container" *ngIf="visible">
      <mat-tab-group animationDuration="0ms" [(selectedIndex)]="selectedTabIndex">
        <mat-tab *ngFor="let tab of tabs; let i = index">
          <ng-template mat-tab-label>
            <div class="tab-label" [style.border-left]="'4px solid ' + tab.color">
              {{ tab.label }}
              <button mat-icon-button (click)="closeTab(i)" class="close-btn">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </ng-template>

          <mat-tree [dataSource]="tab.dataSource" [treeControl]="tab.treeControl">
            <!-- Expandable node -->
            <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
              <button mat-icon-button matTreeNodeToggle>
                <mat-icon>
                  {{ tab.treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right' }}
                </mat-icon>
              </button>
              <span>{{ node.name }}</span>
            </mat-tree-node>
            <!-- Leaf node -->
            <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
              <button mat-icon-button disabled></button>
              <span>{{ node.name }}</span>
            </mat-tree-node>
          </mat-tree>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .right-container {
      height: 100%;
      overflow-y: auto;
      background-color:rgb(202, 215, 238);
      display: flex;
      flex-direction: column;
    }
    mat-tab-group {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    mat-tab-group .mat-tab-body-wrapper {
      flex: 1;
      overflow: auto;
    }
    .tab-label {
      /*
      display: inline-flex;
      align-items: center;
      padding-left: 4px;
      height: 32px;
      */
      /*
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      padding: 0 4px;
      */
      position: relative;
      display: block;
      /*padding: 0 4px 0 4px;*/
      height: 32px;
      line-height: 32px;
      /* Add right padding to account for the close button placed outside */
      padding-right: 70px;
      font-size: 16px;
    }
    .close-btn {
      /*
      margin-left: 8px;
      width: 24px;
      height: 24px;
      min-width: 24px;
      */
      position: absolute;
      right: 4px;
      padding-left: 20px;
      width: 10px;
      height: 10px;
      min-width: 10px;
      font-size: 5px;
      line-height: 10px;
    }
  `]
})
export class RightPaneComponent implements OnInit, OnDestroy {
  /** Whether the pane is shown */
  @Input() visible = true;
  /** Emits submenu labels to open tabs */
  @Input() newTabLabel$!: BehaviorSubject<string | null>;
  /** Shared user list from CenterPaneComponent */
  @Input() userList$!: BehaviorSubject<User[]>;

  tabs: Tab[] = [];
  selectedTabIndex = 0;
  private subs = new Subscription();

  ngOnInit() {
    // Open a new tab on submenu click
    this.subs.add(
      this.newTabLabel$.subscribe(label => {
        if (label) {
          this.addTab(label);
        }
      })
    );
    // Update all tabs when user list changes
    this.subs.add(
      this.userList$.subscribe(() => this.updateAllTabs())
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  /** Transformer from TreeNode to FlatNode */
  private transformer = (node: TreeNode, level: number): FlatNode => ({
    name: node.name,
    level,
    expandable: !!node.children && node.children.length > 0
  });

  private treeControlLevel = (node: FlatNode) => node.level;
  private treeControlExpandable = (node: FlatNode) => node.expandable;

  /** Children accessor for MatTreeFlattener */
  private getChildren = (node: TreeNode) => node.children;
  /** Flat tree hasChild predicate */
  hasChild = (_: number, node: FlatNode) => node.expandable;

  /** Build the hierarchical data from the user list */
  private buildTreeData(): TreeNode[] {
    return this.userList$.getValue().map(u => ({
      name: u.lastName,
      children: [
        { name: `First Name: ${u.firstName}` },
        { name: `Address: ${u.address}` },
        { name: `Email: ${u.email}` },
        { name: `Phone: ${u.phone}` }
      ]
    }));
  }

  /** Generate a random pastel color for the tab border */
  private generateColor(): string {
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `rgb(${r}, ${g}, ${b})`;
  }

  /** Add a new tab with the current user data */
  private addTab(label: string) {
    const color = this.generateColor();
    const treeControl = new FlatTreeControl<FlatNode>(this.treeControlLevel, this.treeControlExpandable);
    const flattener = new MatTreeFlattener<TreeNode, FlatNode>(
      this.transformer,
      this.treeControlLevel,
      this.treeControlExpandable,
      this.getChildren
    );
    const dataSource = new MatTreeFlatDataSource<TreeNode, FlatNode>(treeControl, flattener);
    dataSource.data = this.buildTreeData();

    this.tabs.push({ label, color, treeControl, dataSource });
    this.selectedTabIndex = this.tabs.length - 1;
  }

  /** Update existing tabs when the user list changes */
  private updateAllTabs() {
    const data = this.buildTreeData();
    this.tabs.forEach(tab => (tab.dataSource.data = data));
  }

  /** Close and remove a tab */
  closeTab(index: number) {
    this.tabs.splice(index, 1);
    if (this.selectedTabIndex >= this.tabs.length) {
      this.selectedTabIndex = this.tabs.length - 1;
    }
  }
}