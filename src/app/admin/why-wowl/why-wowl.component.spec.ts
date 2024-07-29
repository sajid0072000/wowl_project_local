import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyWowlComponent } from './why-wowl.component';

describe('WhyWowlComponent', () => {
  let component: WhyWowlComponent;
  let fixture: ComponentFixture<WhyWowlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhyWowlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyWowlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
