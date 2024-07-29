import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WowlUegComponent } from './wowl-ueg.component';

describe('WowlUegComponent', () => {
  let component: WowlUegComponent;
  let fixture: ComponentFixture<WowlUegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WowlUegComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WowlUegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
