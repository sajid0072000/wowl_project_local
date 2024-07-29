import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSafeguardingComponent } from './digital-safeguarding.component';

describe('DigitalSafeguardingComponent', () => {
  let component: DigitalSafeguardingComponent;
  let fixture: ComponentFixture<DigitalSafeguardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalSafeguardingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalSafeguardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
