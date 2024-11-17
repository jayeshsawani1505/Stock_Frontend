import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExpensesComponent } from './add-edit-expenses.component';

describe('AddEditExpensesComponent', () => {
  let component: AddEditExpensesComponent;
  let fixture: ComponentFixture<AddEditExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
