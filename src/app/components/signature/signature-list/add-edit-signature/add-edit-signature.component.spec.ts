import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSignatureComponent } from './add-edit-signature.component';

describe('AddEditSignatureComponent', () => {
  let component: AddEditSignatureComponent;
  let fixture: ComponentFixture<AddEditSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditSignatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
