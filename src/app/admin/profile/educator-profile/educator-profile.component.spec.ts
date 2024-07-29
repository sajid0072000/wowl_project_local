import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducatorProfileComponent } from './educator-profile.component';

describe('EducatorProfileComponent', () => {
  let component: EducatorProfileComponent;
  let fixture: ComponentFixture<EducatorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducatorProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducatorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
