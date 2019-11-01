import { TestBed, inject } from '@angular/core/testing';

import { ParkingService } from './parking.service';

describe('ParkingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParkingService]
    });
  });

  it('should be created', inject([ParkingService], (service: ParkingService) => {
    expect(service).toBeTruthy();
  }));
});
