import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBrandsComponent } from './add-edit-brands.component';

describe('AddEditBrandsComponent', () => {
  let component: AddEditBrandsComponent;
  let fixture: ComponentFixture<AddEditBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditBrandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
