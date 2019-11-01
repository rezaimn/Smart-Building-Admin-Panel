import { TestBed, inject } from '@angular/core/testing';

import { WorkPolicyService } from './work-policy.service';

describe('WorkPolicyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkPolicyService]
    });
  });

  it('should be created', inject([WorkPolicyService], (service: WorkPolicyService) => {
    expect(service).toBeTruthy();
  }));
});
