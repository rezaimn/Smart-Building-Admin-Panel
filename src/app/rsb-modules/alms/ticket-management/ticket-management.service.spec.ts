import { TestBed, inject } from '@angular/core/testing';

import { TicketManagementService } from './ticket-management.service';

describe('TicketManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TicketManagementService]
    });
  });

  it('should be created', inject([TicketManagementService], (service: TicketManagementService) => {
    expect(service).toBeTruthy();
  }));
});
