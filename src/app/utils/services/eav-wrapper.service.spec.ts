import { TestBed, inject } from '@angular/core/testing';

import { EavWrapperService } from './eav-wrapper.service';

describe('EavWrapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EavWrapperService]
    });
  });

  it('should be created', inject([EavWrapperService], (service: EavWrapperService) => {
    expect(service).toBeTruthy();
  }));
});
