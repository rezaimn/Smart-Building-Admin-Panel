import { TestBed, inject } from '@angular/core/testing';

import { EmergencyService } from './emergency.service';

describe('EmergencyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmergencyService]
    });
  });

  it('should be created', inject([EmergencyService], (service: EmergencyService) => {
    expect(service).toBeTruthy();
  }));
});
