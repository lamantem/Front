import { TestBed } from '@angular/core/testing';

import { DashboardCreateService } from './dashboard-create.service';

describe('DashboardCreateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardCreateService = TestBed.get(DashboardCreateService);
    expect(service).toBeTruthy();
  });
});
