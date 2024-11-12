import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubProductListComponent } from './sub-product-list.component';

describe('SubProductListComponent', () => {
  let component: SubProductListComponent;
  let fixture: ComponentFixture<SubProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubProductListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
