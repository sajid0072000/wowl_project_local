import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseSubscriptionComponent } from './add-course-subscription.component';

describe('AddCourseSubscriptionComponent', () => {
  let component: AddCourseSubscriptionComponent;
  let fixture: ComponentFixture<AddCourseSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCourseSubscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCourseSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
