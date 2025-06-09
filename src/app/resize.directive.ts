// This directive allows resizing of two adjacent panes by dragging a divider.
// It listens for mouse events to adjust the widths of the panes dynamically.

import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[appResize]',
  standalone: true
})
export class ResizeDirective implements OnInit, OnDestroy {
  @Input('prev') prevPane!: HTMLElement;
  @Input('next') nextPane!: HTMLElement;

  private dragging = false;
  private moveSub!: Subscription;
  private upSub!: Subscription;
  private startX = 0;
  private prevWidth = 0;
  private nextWidth = 0;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    // Ensure the divider has cursor style
    this.el.nativeElement.style.cursor = 'col-resize';
    this.el.nativeElement.style.userSelect = 'none';
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.dragging = true;
    this.startX = event.clientX;

    const prevRect = this.prevPane.getBoundingClientRect();
    const nextRect = this.nextPane.getBoundingClientRect();
    this.prevWidth = prevRect.width;
    this.nextWidth = nextRect.width;

    // Listen to document mousemove and mouseup
    this.moveSub = fromEvent<MouseEvent>(document, 'mousemove').subscribe(e => this.onMouseMove(e));
    this.upSub = fromEvent<MouseEvent>(document, 'mouseup').subscribe(() => this.onMouseUp());
  }

  onMouseMove(event: MouseEvent) {
    if (!this.dragging) {
      return;
    }
    const dx = event.clientX - this.startX; // positive if moving right

    // Compute new widths
    const newPrevWidth = this.prevWidth + dx;
    const newNextWidth = this.nextWidth - dx;

    // Minimum width to avoid collapsing completely
    const minWidth = 100; // px
    if (newPrevWidth < minWidth || newNextWidth < minWidth) {
      return;
    }
    // Set flex-basis on prev and next
    this.prevPane.style.flex = `0 0 ${newPrevWidth}px`;
    this.nextPane.style.flex = `0 0 ${newNextWidth}px`;
  }

  onMouseUp() {
    this.dragging = false;
    if (this.moveSub) {
      this.moveSub.unsubscribe();
    }
    if (this.upSub) {
      this.upSub.unsubscribe();
    }
  }

  ngOnDestroy() {
    if (this.moveSub) {
      this.moveSub.unsubscribe();
    }
    if (this.upSub) {
      this.upSub.unsubscribe();
    }
  }
}
