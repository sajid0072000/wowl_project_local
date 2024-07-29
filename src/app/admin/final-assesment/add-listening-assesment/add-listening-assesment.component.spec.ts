import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListeningAssesmentComponent } from './add-listening-assesment.component';

describe('AddListeningAssesmentComponent', () => {
  let component: AddListeningAssesmentComponent;
  let fixture: ComponentFixture<AddListeningAssesmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddListeningAssesmentComponent]
    });
    fixture = TestBed.createComponent(AddListeningAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
