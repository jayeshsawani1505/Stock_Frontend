import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubProductDeleteComponent } from './sub-product-delete.component';

describe('SubProductDeleteComponent', () => {
  let component: SubProductDeleteComponent;
  let fixture: ComponentFixture<SubProductDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubProductDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubProductDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
