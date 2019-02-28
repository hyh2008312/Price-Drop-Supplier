import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingEditComponent } from './landing-edit.component';

describe('LandingEditComponent', () => {
  let component: LandingEditComponent;
  let fixture: ComponentFixture<LandingEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
