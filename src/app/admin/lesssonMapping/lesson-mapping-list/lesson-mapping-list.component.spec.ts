import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonMappingListComponent } from './lesson-mapping-list.component';

describe('LessonMappingListComponent', () => {
  let component: LessonMappingListComponent;
  let fixture: ComponentFixture<LessonMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonMappingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
