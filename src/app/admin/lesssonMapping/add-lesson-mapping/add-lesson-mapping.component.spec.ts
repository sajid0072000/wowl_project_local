import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLessonMappingComponent } from './add-lesson-mapping.component';

describe('AddLessonMappingComponent', () => {
  let component: AddLessonMappingComponent;
  let fixture: ComponentFixture<AddLessonMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLessonMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLessonMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
