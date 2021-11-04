import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechstatevsnComponent } from './techstatevsn.component';

describe('TechstatevsnComponent', () => {
  let component: TechstatevsnComponent;
  let fixture: ComponentFixture<TechstatevsnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechstatevsnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechstatevsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
