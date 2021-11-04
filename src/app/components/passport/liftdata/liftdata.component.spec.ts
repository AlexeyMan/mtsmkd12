import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LiftData} from './liftdata.component';

describe('LiftData', () => {
  let component: LiftData;
  let fixture: ComponentFixture<LiftData>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiftData ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiftData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
