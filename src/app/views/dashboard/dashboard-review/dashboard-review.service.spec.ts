import { TestBed } from '@angular/core/testing';

import { DashboardReviewService } from './dashboard-review.service';

describe('DashboardReviewService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DashboardReviewService = TestBed.get(DashboardReviewService);
        expect(service).toBeTruthy();
    });
});
