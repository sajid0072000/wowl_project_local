import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingAssesmentListComponent } from './reading-assesment-list.component';

describe('ReadingAssesmentListComponent', () => {
  let component: ReadingAssesmentListComponent;
  let fixture: ComponentFixture<ReadingAssesmentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadingAssesmentListComponent]
    });
    fixture = TestBed.createComponent(ReadingAssesmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
