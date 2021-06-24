import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSizesComponent } from './tab-sizes.component';

describe('TabSizesComponent', () => {
  let component: TabSizesComponent;
  let fixture: ComponentFixture<TabSizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabSizesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabSizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
