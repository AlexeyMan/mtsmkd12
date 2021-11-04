import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechstatenewComponent } from './techstatenew.component';

describe('TechstatenewComponent', () => {
  let component: TechstatenewComponent;
  let fixture: ComponentFixture<TechstatenewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechstatenewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechstatenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
