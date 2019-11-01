import { TestBed, inject } from '@angular/core/testing';

import { AlertManagementService } from './alert-management.service';

describe('AlertManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertManagementService]
    });
  });

  it('should be created', inject([AlertManagementService], (service: AlertManagementService) => {
    expect(service).toBeTruthy();
  }));
});
