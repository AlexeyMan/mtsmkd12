import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListfavoritetepsComponent } from './listfavoriteteps.component';

describe('ListfavoritetepsComponent', () => {
  let component: ListfavoritetepsComponent;
  let fixture: ComponentFixture<ListfavoritetepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListfavoritetepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListfavoritetepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
