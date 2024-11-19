import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNotesAddEditComponent } from './credit-notes-add-edit.component';

describe('CreditNotesAddEditComponent', () => {
  let component: CreditNotesAddEditComponent;
  let fixture: ComponentFixture<CreditNotesAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditNotesAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditNotesAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
