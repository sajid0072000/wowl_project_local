import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedprofileListComponent } from './deletedprofile-list.component';

describe('DeletedprofileListComponent', () => {
  let component: DeletedprofileListComponent;
  let fixture: ComponentFixture<DeletedprofileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedprofileListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedprofileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
