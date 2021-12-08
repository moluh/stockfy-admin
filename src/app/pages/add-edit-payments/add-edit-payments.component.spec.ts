import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPaymentsComponent } from './add-edit-payments.component';

describe('AddEditUsuariosComponent', () => {
  let component: AddEditPaymentsComponent;
  let fixture: ComponentFixture<AddEditPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditPaymentsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
