import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourselessonComponent } from './courselesson.component';

describe('CourselessonComponent', () => {
  let component: CourselessonComponent;
  let fixture: ComponentFixture<CourselessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourselessonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourselessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
