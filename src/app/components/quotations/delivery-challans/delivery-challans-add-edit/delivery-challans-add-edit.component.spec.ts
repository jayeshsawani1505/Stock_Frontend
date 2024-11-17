import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryChallansAddEditComponent } from './delivery-challans-add-edit.component';

describe('DeliveryChallansAddEditComponent', () => {
  let component: DeliveryChallansAddEditComponent;
  let fixture: ComponentFixture<DeliveryChallansAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryChallansAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryChallansAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
