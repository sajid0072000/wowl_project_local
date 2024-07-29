import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCourseAuditComponent } from './user-course-audit.component';

describe('UserCourseAuditComponent', () => {
  let component: UserCourseAuditComponent;
  let fixture: ComponentFixture<UserCourseAuditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCourseAuditComponent]
    });
    fixture = TestBed.createComponent(UserCourseAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
