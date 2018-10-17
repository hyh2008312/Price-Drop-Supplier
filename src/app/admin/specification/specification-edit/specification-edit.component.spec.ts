import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificaitonEditComponent } from './specification-edit.component';

describe('SpecificaitonEditComponent', () => {
  let component: SpecificaitonEditComponent;
  let fixture: ComponentFixture<SpecificaitonEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificaitonEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificaitonEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
