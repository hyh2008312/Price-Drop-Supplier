import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteCategoryTitleComponent } from './promote-category-title.component';

describe('PromoteCategoryTitleComponent', () => {
  let component: PromoteCategoryTitleComponent;
  let fixture: ComponentFixture<PromoteCategoryTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoteCategoryTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoteCategoryTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
