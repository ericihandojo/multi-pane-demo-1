import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPaneComponent } from './top-pane.component';

describe('TopPaneComponent', () => {
  let component: TopPaneComponent;
  let fixture: ComponentFixture<TopPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopPaneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
