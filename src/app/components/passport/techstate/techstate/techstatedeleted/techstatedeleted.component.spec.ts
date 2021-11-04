import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechstatedeletedComponent } from './techstatedeleted.component';

describe('TechstatedeletedComponent', () => {
  let component: TechstatedeletedComponent;
  let fixture: ComponentFixture<TechstatedeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechstatedeletedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechstatedeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
