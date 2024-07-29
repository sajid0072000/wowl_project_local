import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReadingAssesmentComponent } from './add-reading-assesment.component';

describe('AddReadingAssesmentComponent', () => {
  let component: AddReadingAssesmentComponent;
  let fixture: ComponentFixture<AddReadingAssesmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddReadingAssesmentComponent]
    });
    fixture = TestBed.createComponent(AddReadingAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
