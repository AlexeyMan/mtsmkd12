import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoninformationComponent } from './commoninformation.component';

describe('CommoninformationComponent', () => {
  let component: CommoninformationComponent;
  let fixture: ComponentFixture<CommoninformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommoninformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoninformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
