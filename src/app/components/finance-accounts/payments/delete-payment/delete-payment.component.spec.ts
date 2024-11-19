import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePaymentComponent } from './delete-payment.component';

describe('DeletePaymentComponent', () => {
  let component: DeletePaymentComponent;
  let fixture: ComponentFixture<DeletePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
