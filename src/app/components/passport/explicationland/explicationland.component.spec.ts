import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExplicationlandComponent} from './explicationland.component';

describe('ExplicationlandComponent', () => {
  let component: ExplicationlandComponent;
  let fixture: ComponentFixture<ExplicationlandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplicationlandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplicationlandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
