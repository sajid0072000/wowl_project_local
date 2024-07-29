import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationVersionComponent } from './application-version.component';

describe('ApplicationVersionComponent', () => {
  let component: ApplicationVersionComponent;
  let fixture: ComponentFixture<ApplicationVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationVersionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
