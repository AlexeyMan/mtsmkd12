import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnergcostComponent} from './energcost.component';

describe('EnergcostComponent', () => {
  let component: EnergcostComponent;
  let fixture: ComponentFixture<EnergcostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergcostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
