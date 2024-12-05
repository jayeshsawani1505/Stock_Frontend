import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePurchaseStatusComponent } from './change-purchase-status.component';

describe('ChangePurchaseStatusComponent', () => {
  let component: ChangePurchaseStatusComponent;
  let fixture: ComponentFixture<ChangePurchaseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePurchaseStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePurchaseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
