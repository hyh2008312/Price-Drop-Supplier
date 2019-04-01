import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTitleFixedComponent } from './location-title-fixed.component';

describe('LocationTitleFixedComponent', () => {
  let component: LocationTitleFixedComponent;
  let fixture: ComponentFixture<LocationTitleFixedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationTitleFixedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTitleFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
