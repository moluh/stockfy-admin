import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedListItemComponent } from './expanded-list-item.component';

describe('ExpandedListItemComponent', () => {
  let component: ExpandedListItemComponent;
  let fixture: ComponentFixture<ExpandedListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpandedListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandedListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
