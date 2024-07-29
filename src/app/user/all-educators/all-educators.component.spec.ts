import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEducatorsComponent } from './all-educators.component';

describe('AllEducatorsComponent', () => {
  let component: AllEducatorsComponent;
  let fixture: ComponentFixture<AllEducatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllEducatorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEducatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
