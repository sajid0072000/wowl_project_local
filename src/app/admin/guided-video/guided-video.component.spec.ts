import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidedVideoComponent } from './guided-video.component';

describe('GuidedVideoComponent', () => {
  let component: GuidedVideoComponent;
  let fixture: ComponentFixture<GuidedVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuidedVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuidedVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
