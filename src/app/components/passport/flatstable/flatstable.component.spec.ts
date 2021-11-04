import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlatstableComponent} from './flatstable.component';

describe('FlatstableComponent', () => {
  let component: FlatstableComponent;
  let fixture: ComponentFixture<FlatstableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatstableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatstableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
