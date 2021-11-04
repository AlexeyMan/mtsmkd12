import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NewpassportComponent} from './newpassport.component';

describe('NewpassportComponent', () => {
  let component: NewpassportComponent;
  let fixture: ComponentFixture<NewpassportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewpassportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpassportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
