import { TestBed } from '@angular/core/testing';

import { DashboardGenerateService } from './dashboard-generate.service';

describe('DashboardCreateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardGenerateService = TestBed.get(DashboardGenerateService);
    expect(service).toBeTruthy();
  });
});
