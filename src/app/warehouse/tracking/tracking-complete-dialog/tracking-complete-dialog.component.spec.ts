import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingCompleteDialogComponent } from './tracking-complete-dialog.component';

describe('TrackingCompleteDialogComponent', () => {
  let component: TrackingCompleteDialogComponent;
  let fixture: ComponentFixture<TrackingCompleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingCompleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingCompleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
