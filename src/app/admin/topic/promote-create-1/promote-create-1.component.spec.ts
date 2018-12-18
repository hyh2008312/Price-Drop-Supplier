import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteCreateOneComponent } from './promote-create-1.component';

describe('PromoteCreateOneComponent', () => {
  let component: PromoteCreateOneComponent;
  let fixture: ComponentFixture<PromoteCreateOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoteCreateOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoteCreateOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
