import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditClientesComponent } from './add-edit-clientes.component';

describe('AddEditClientesComponent', () => {
  let component: AddEditClientesComponent;
  let fixture: ComponentFixture<AddEditClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditClientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
