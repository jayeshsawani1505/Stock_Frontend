import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPaymentComponent } from './add-edit-payment.component';

describe('AddEditPaymentComponent', () => {
  let component: AddEditPaymentComponent;
  let fixture: ComponentFixture<AddEditPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
