import { TestBed, inject } from '@angular/core/testing';

import { HvacService } from './hvac.service';

describe('HvacService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HvacService]
    });
  });

  it('should be created', inject([HvacService], (service: HvacService) => {
    expect(service).toBeTruthy();
  }));
});
