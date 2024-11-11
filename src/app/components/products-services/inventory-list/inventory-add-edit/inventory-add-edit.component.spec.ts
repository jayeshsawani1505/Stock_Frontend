import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAddEditComponent } from './inventory-add-edit.component';

describe('InventoryAddEditComponent', () => {
  let component: InventoryAddEditComponent;
  let fixture: ComponentFixture<InventoryAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
