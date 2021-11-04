import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DebugpanelComponent} from './debugpanel.component';

describe('DebugpanelComponent', () => {
  let component: DebugpanelComponent;
  let fixture: ComponentFixture<DebugpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
