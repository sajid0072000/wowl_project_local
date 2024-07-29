import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorytypeComponent } from './categorytype.component';

describe('CategorytypeComponent', () => {
  let component: CategorytypeComponent;
  let fixture: ComponentFixture<CategorytypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorytypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorytypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
