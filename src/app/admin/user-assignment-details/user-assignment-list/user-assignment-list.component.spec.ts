import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignmentListComponent } from './user-assignment-list.component';

describe('UserAssignmentListComponent', () => {
  let component: UserAssignmentListComponent;
  let fixture: ComponentFixture<UserAssignmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAssignmentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAssignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
