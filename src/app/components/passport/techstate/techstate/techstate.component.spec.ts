import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TechstateComponent} from './techstate.component';

describe('TechstateComponent', () => {
  let component: TechstateComponent;
  let fixture: ComponentFixture<TechstateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechstateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
