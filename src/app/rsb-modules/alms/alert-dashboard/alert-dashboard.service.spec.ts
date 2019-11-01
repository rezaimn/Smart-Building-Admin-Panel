import { TestBed, inject } from '@angular/core/testing';

import { AlertDashboardService } from './alert-dashboard.service';

describe('AlertDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertDashboardService]
    });
  });

  it('should be created', inject([AlertDashboardService], (service: AlertDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
