import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeningAssesmentListComponent } from './listening-assesment-list.component';

describe('ListeningAssesmentListComponent', () => {
  let component: ListeningAssesmentListComponent;
  let fixture: ComponentFixture<ListeningAssesmentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeningAssesmentListComponent]
    });
    fixture = TestBed.createComponent(ListeningAssesmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
