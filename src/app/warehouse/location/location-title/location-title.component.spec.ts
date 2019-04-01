import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTitleComponent } from './location-title.component';

describe('LocationTitleComponent', () => {
  let component: LocationTitleComponent;
  let fixture: ComponentFixture<LocationTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
