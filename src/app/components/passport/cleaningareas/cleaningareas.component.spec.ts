import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CleaningareasComponent} from './cleaningareas.component';

describe('CleaningareasComponent', () => {
  let component: CleaningareasComponent;
  let fixture: ComponentFixture<CleaningareasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleaningareasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
