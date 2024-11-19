import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeInvoiceStatusComponent } from './change-invoice-status.component';

describe('ChangeInvoiceStatusComponent', () => {
  let component: ChangeInvoiceStatusComponent;
  let fixture: ComponentFixture<ChangeInvoiceStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeInvoiceStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeInvoiceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
