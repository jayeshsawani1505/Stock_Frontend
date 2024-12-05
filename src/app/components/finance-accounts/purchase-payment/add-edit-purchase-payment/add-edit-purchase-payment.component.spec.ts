import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPurchasePaymentComponent } from './add-edit-purchase-payment.component';

describe('AddEditPurchasePaymentComponent', () => {
  let component: AddEditPurchasePaymentComponent;
  let fixture: ComponentFixture<AddEditPurchasePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPurchasePaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPurchasePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
