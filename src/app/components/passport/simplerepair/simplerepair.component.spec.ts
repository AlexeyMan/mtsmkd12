import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SimplerepairComponent} from './simplerepair.component';

describe('SimplerepairComponent', () => {
  let component: SimplerepairComponent;
  let fixture: ComponentFixture<SimplerepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimplerepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplerepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
