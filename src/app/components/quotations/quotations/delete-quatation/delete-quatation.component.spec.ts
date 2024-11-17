import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteQuatationComponent } from './delete-quatation.component';

describe('DeleteQuatationComponent', () => {
  let component: DeleteQuatationComponent;
  let fixture: ComponentFixture<DeleteQuatationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteQuatationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteQuatationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
