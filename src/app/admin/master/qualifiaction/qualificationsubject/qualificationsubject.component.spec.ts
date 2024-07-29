import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationsubjectComponent } from './qualificationsubject.component';

describe('QualificationsubjectComponent', () => {
  let component: QualificationsubjectComponent;
  let fixture: ComponentFixture<QualificationsubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualificationsubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualificationsubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
