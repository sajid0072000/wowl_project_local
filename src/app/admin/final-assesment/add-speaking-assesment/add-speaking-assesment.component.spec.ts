import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpeakingAssesmentComponent } from './add-speaking-assesment.component';

describe('AddSpeakingAssesmentComponent', () => {
  let component: AddSpeakingAssesmentComponent;
  let fixture: ComponentFixture<AddSpeakingAssesmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSpeakingAssesmentComponent]
    });
    fixture = TestBed.createComponent(AddSpeakingAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
