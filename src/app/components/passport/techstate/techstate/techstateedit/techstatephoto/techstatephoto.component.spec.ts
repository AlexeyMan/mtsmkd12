import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechstatephotoComponent } from './techstatephoto.component';

describe('TechstatephotoComponent', () => {
  let component: TechstatephotoComponent;
  let fixture: ComponentFixture<TechstatephotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechstatephotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechstatephotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
