import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInTableDialogComponent } from './add-in-table-dialog.component';

describe('AddInTableDialogComponent', () => {
  let component: AddInTableDialogComponent;
  let fixture: ComponentFixture<AddInTableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInTableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
