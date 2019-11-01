import { TestBed, inject } from '@angular/core/testing';

import { AllowanceService } from './allowance.service';

describe('AllowanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllowanceService]
    });
  });

  it('should be created', inject([AllowanceService], (service: AllowanceService) => {
    expect(service).toBeTruthy();
  }));
});
