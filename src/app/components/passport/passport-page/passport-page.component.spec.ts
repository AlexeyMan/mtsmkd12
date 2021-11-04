import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassportPageComponent } from './passport-page.component';

describe('PassportPageComponent', () => {
  let component: PassportPageComponent;
  let fixture: ComponentFixture<PassportPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassportPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
