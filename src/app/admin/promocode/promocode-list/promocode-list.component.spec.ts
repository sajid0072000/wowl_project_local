import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocodeListComponent } from './promocode-list.component';

describe('PromocodeListComponent', () => {
  let component: PromocodeListComponent;
  let fixture: ComponentFixture<PromocodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromocodeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromocodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
