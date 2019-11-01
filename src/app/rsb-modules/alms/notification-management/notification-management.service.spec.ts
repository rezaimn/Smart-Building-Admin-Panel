import { TestBed, inject } from '@angular/core/testing';

import { NotificationManagementService } from './notification-management.service';

describe('NotificationManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationManagementService]
    });
  });

  it('should be created', inject([NotificationManagementService], (service: NotificationManagementService) => {
    expect(service).toBeTruthy();
  }));
});
