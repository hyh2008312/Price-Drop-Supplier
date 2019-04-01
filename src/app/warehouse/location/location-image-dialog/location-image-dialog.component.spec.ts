import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationImageDialogComponent } from './location-image-dialog.component';

describe('LocationImageDialogComponent', () => {
  let component: LocationImageDialogComponent;
  let fixture: ComponentFixture<LocationImageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationImageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
