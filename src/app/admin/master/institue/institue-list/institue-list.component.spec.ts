import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitueListComponent } from './institue-list.component';

describe('InstitueListComponent', () => {
  let component: InstitueListComponent;
  let fixture: ComponentFixture<InstitueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitueListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
