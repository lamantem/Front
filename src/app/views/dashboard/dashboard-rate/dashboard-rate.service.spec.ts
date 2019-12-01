import { TestBed } from '@angular/core/testing';

import { DashboardRateService } from './dashboard-rate.service';

describe('DashboardCreateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardRateService = TestBed.get(DashboardRateService);
    expect(service).toBeTruthy();
  });
});
