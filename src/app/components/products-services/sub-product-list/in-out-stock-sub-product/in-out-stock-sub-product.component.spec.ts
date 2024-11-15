import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InOutStockSubProductComponent } from './in-out-stock-sub-product.component';

describe('InOutStockSubProductComponent', () => {
  let component: InOutStockSubProductComponent;
  let fixture: ComponentFixture<InOutStockSubProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InOutStockSubProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InOutStockSubProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
