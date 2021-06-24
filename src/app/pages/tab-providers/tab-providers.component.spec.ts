import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabProvidersComponent } from './tab-providers.component';

describe('TabProvidersComponent', () => {
  let component: TabProvidersComponent;
  let fixture: ComponentFixture<TabProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
