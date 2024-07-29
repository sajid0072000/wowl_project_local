import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalAssesmentComponent } from './final-assesment.component';

describe('FinalAssesmentComponent', () => {
  let component: FinalAssesmentComponent;
  let fixture: ComponentFixture<FinalAssesmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalAssesmentComponent]
    });
    fixture = TestBed.createComponent(FinalAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
