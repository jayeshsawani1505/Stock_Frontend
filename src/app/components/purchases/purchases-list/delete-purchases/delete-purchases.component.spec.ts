import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePurchasesComponent } from './delete-purchases.component';

describe('DeletePurchasesComponent', () => {
  let component: DeletePurchasesComponent;
  let fixture: ComponentFixture<DeletePurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePurchasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
