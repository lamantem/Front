import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardFormComponent } from './dasboard-form.component';

describe('DasboardFormComponent', () => {
  let component: DasboardFormComponent;
  let fixture: ComponentFixture<DasboardFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DasboardFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DasboardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
