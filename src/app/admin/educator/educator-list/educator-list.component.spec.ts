import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducatorListComponent } from './educator-list.component';

describe('EducatorListComponent', () => {
  let component: EducatorListComponent;
  let fixture: ComponentFixture<EducatorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducatorListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
