import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardReaderComponent } from './dashboard-reader.component';

describe('DashboardReaderComponent', () => {
  let component: DashboardReaderComponent;
  let fixture: ComponentFixture<DashboardReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardReaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
