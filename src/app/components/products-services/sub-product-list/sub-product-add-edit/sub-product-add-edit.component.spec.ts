import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubProductAddEditComponent } from './sub-product-add-edit.component';

describe('SubProductAddEditComponent', () => {
  let component: SubProductAddEditComponent;
  let fixture: ComponentFixture<SubProductAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubProductAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubProductAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
