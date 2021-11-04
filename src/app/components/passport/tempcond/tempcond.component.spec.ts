import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TempcondComponent} from './tempcond.component';

describe('TempcondComponent', () => {
  let component: TempcondComponent;
  let fixture: ComponentFixture<TempcondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempcondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempcondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
