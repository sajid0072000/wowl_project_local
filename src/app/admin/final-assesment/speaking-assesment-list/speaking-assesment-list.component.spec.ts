import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakingAssesmentListComponent } from './speaking-assesment-list.component';

describe('SpeakingAssesmentListComponent', () => {
  let component: SpeakingAssesmentListComponent;
  let fixture: ComponentFixture<SpeakingAssesmentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpeakingAssesmentListComponent]
    });
    fixture = TestBed.createComponent(SpeakingAssesmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
