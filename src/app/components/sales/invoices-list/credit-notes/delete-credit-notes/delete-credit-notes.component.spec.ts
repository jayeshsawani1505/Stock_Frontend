import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCreditNotesComponent } from './delete-credit-notes.component';

describe('DeleteCreditNotesComponent', () => {
  let component: DeleteCreditNotesComponent;
  let fixture: ComponentFixture<DeleteCreditNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCreditNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCreditNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
