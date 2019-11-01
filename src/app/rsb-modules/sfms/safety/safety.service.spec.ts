import { TestBed, inject } from '@angular/core/testing';

import { SafetyService } from './safety.service';

describe('SafetyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafetyService]
    });
  });

  it('should be created', inject([SafetyService], (service: SafetyService) => {
    expect(service).toBeTruthy();
  }));
});
