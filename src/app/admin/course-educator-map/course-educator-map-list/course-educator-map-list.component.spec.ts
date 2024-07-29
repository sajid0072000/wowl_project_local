import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEducatorMapListComponent } from './course-educator-map-list.component';

describe('CourseEducatorMapListComponent', () => {
  let component: CourseEducatorMapListComponent;
  let fixture: ComponentFixture<CourseEducatorMapListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseEducatorMapListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseEducatorMapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
