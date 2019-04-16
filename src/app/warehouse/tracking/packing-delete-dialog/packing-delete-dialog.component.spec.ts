import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingDeleteDialogComponent } from './packing-delete-dialog.component';

describe('PackingDeleteDialogComponent', () => {
  let component: PackingDeleteDialogComponent;
  let fixture: ComponentFixture<PackingDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
