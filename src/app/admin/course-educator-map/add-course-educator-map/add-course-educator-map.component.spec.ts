import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseEducatorMapComponent } from './add-course-educator-map.component';

describe('AddCourseEducatorMapComponent', () => {
  let component: AddCourseEducatorMapComponent;
  let fixture: ComponentFixture<AddCourseEducatorMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCourseEducatorMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCourseEducatorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
