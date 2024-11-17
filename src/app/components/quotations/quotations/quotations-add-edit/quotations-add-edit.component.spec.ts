import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationsAddEditComponent } from './quotations-add-edit.component';

describe('QuotationsAddEditComponent', () => {
  let component: QuotationsAddEditComponent;
  let fixture: ComponentFixture<QuotationsAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotationsAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
