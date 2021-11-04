import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechstatecommissionComponent } from './techstatecommission.component';

describe('TechstatecommissionComponent', () => {
  let component: TechstatecommissionComponent;
  let fixture: ComponentFixture<TechstatecommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechstatecommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechstatecommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
