import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MeteringdevicesComponent} from './meteringdevices.component';

describe('MeteringdevicesComponent', () => {
  let component: MeteringdevicesComponent;
  let fixture: ComponentFixture<MeteringdevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeteringdevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeteringdevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
