import { TestBed, inject } from '@angular/core/testing';

import { SurveillanceService } from './surveillance.service';

describe('SurveillanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurveillanceService]
    });
  });

  it('should be created', inject([SurveillanceService], (service: SurveillanceService) => {
    expect(service).toBeTruthy();
  }));
});
