import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddwowalTeamComponent } from './addwowal-team.component';

describe('AddwowalTeamComponent', () => {
  let component: AddwowalTeamComponent;
  let fixture: ComponentFixture<AddwowalTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddwowalTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddwowalTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
