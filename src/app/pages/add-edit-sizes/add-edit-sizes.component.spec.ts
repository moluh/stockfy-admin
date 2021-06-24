import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSizesComponent } from './add-edit-sizes.component';

describe('AddEditSizesComponent', () => {
  let component: AddEditSizesComponent;
  let fixture: ComponentFixture<AddEditSizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSizesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
