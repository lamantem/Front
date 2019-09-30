import { TestBed } from '@angular/core/testing';

import { DashboardReaderService } from './dashboard-reader.service';

describe('DashboardReaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardReaderService = TestBed.get(DashboardReaderService);
    expect(service).toBeTruthy();
  });
});
