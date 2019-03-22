import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOrderDialogComponent } from './upload-order-dialog.component';

describe('UploadOrderDialogComponent', () => {
  let component: UploadOrderDialogComponent;
  let fixture: ComponentFixture<UploadOrderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadOrderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
