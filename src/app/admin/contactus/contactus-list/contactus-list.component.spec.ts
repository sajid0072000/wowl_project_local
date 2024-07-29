import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactusListComponent } from './contactus-list.component';

describe('ContactusListComponent', () => {
  let component: ContactusListComponent;
  let fixture: ComponentFixture<ContactusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactusListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
