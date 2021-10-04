import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {TepTableComponent} from './tep-table.component';

describe('TepTableComponent', () => {
  let component: TepTableComponent;
  let fixture: ComponentFixture<TepTableComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TepTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TepTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
