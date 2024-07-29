import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLessionComponent } from './add-lession.component';

describe('AddLessionComponent', () => {
  let component: AddLessionComponent;
  let fixture: ComponentFixture<AddLessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
