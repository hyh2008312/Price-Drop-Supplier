import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingCreateComponent } from './landing-create.component';

describe('LandingCreateComponent', () => {
  let component: LandingCreateComponent;
  let fixture: ComponentFixture<LandingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
