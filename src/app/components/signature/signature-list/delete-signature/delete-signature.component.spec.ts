import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSignatureComponent } from './delete-signature.component';

describe('DeleteSignatureComponent', () => {
  let component: DeleteSignatureComponent;
  let fixture: ComponentFixture<DeleteSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSignatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
