import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotProductMainComponent } from './hot-product-main.component';

describe('HotProductMainComponent', () => {
  let component: HotProductMainComponent;
  let fixture: ComponentFixture<HotProductMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotProductMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotProductMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
