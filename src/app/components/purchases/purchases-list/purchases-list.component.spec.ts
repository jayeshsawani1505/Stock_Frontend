import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesListComponent } from './purchases-list.component';

describe('PurchasesListComponent', () => {
  let component: PurchasesListComponent;
  let fixture: ComponentFixture<PurchasesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
