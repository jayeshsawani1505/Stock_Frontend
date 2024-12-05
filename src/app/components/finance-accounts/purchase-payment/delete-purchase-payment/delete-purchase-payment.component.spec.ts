import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePurchasePaymentComponent } from './delete-purchase-payment.component';

describe('DeletePurchasePaymentComponent', () => {
  let component: DeletePurchasePaymentComponent;
  let fixture: ComponentFixture<DeletePurchasePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePurchasePaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePurchasePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
