import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChallanComponent } from './delete-challan.component';

describe('DeleteChallanComponent', () => {
  let component: DeleteChallanComponent;
  let fixture: ComponentFixture<DeleteChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteChallanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
