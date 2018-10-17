import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationCreateComponent } from './specification-create.component';

describe('SpecificationCreateComponent', () => {
  let component: SpecificationCreateComponent;
  let fixture: ComponentFixture<SpecificationCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificationCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
