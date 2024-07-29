import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgChunkUploadComponent } from './ng-chunk-upload.component';

describe('NgChunkUploadComponent', () => {
  let component: NgChunkUploadComponent;
  let fixture: ComponentFixture<NgChunkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgChunkUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgChunkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
