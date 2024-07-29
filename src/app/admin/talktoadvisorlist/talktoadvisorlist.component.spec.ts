import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalktoadvisorlistComponent } from './talktoadvisorlist.component';

describe('TalktoadvisorlistComponent', () => {
  let component: TalktoadvisorlistComponent;
  let fixture: ComponentFixture<TalktoadvisorlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalktoadvisorlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalktoadvisorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
