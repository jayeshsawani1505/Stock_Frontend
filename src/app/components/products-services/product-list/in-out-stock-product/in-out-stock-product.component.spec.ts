import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InOutStockProductComponent } from './in-out-stock-product.component';

describe('InOutStockProductComponent', () => {
  let component: InOutStockProductComponent;
  let fixture: ComponentFixture<InOutStockProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InOutStockProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InOutStockProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
