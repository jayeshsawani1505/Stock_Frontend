import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNotesComponent } from './credit-notes.component';

describe('CreditNotesComponent', () => {
  let component: CreditNotesComponent;
  let fixture: ComponentFixture<CreditNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
