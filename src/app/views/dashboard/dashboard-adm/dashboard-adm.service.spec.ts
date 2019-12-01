import { TestBed } from '@angular/core/testing';

import { DashboardAdmService } from './dashboard-adm.service';

describe('DashboardAdmService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DashboardAdmService = TestBed.get(DashboardAdmService);
        expect(service).toBeTruthy();
    });
});
