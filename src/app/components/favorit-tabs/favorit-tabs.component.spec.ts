import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritTabsComponent } from './favorit-tabs.component';

describe('FavoritTabsComponent', () => {
  let component: FavoritTabsComponent;
  let fixture: ComponentFixture<FavoritTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
