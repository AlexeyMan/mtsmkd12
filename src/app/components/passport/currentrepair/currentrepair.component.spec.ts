import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentrepairComponent } from './currentrepair.component';

describe('CurrentrepairComponent', () => {
  let component: CurrentrepairComponent;
  let fixture: ComponentFixture<CurrentrepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentrepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentrepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
