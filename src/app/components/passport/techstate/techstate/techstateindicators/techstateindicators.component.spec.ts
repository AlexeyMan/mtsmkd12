import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechstateindicatorsComponent } from './techstateindicators.component';

describe('TechstateindicatorsComponent', () => {
  let component: TechstateindicatorsComponent;
  let fixture: ComponentFixture<TechstateindicatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechstateindicatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechstateindicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
