import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechstateeditComponent } from './techstateedit.component';

describe('TechstateeditComponent', () => {
  let component: TechstateeditComponent;
  let fixture: ComponentFixture<TechstateeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechstateeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechstateeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
