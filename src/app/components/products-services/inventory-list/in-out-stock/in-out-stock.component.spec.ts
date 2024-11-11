import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InOutStockComponent } from './in-out-stock.component';

describe('InOutStockComponent', () => {
  let component: InOutStockComponent;
  let fixture: ComponentFixture<InOutStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InOutStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InOutStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
