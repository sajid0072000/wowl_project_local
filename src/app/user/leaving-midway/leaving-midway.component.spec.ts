import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavingMidwayComponent } from './leaving-midway.component';

describe('LeavingMidwayComponent', () => {
  let component: LeavingMidwayComponent;
  let fixture: ComponentFixture<LeavingMidwayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavingMidwayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavingMidwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
