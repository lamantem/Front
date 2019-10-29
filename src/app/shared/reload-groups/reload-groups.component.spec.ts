import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReloadGroupsComponent } from './reload-groups.component';

describe('ReloadGroupsComponent', () => {
  let component: ReloadGroupsComponent;
  let fixture: ComponentFixture<ReloadGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReloadGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReloadGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
