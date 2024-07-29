import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalLearningComponent } from './additional-learning.component';

describe('AdditionalLearningComponent', () => {
  let component: AdditionalLearningComponent;
  let fixture: ComponentFixture<AdditionalLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalLearningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
