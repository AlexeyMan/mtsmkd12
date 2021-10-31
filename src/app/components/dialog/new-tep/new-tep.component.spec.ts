import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTepComponent } from './new-tep.component';

describe('NewTepComponent', () => {
  let component: NewTepComponent;
  let fixture: ComponentFixture<NewTepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
