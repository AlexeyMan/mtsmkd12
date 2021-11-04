import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnerguseComponent} from './energuse.component';

describe('EnerguseComponent', () => {
  let component: EnerguseComponent;
  let fixture: ComponentFixture<EnerguseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnerguseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnerguseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
