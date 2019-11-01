import { TestBed, inject } from '@angular/core/testing';

import { VisitorService } from './visitor.service';

describe('StaffService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisitorService]
    });
  });

  it('should be created', inject([VisitorService], (service: VisitorService) => {
    expect(service).toBeTruthy();
  }));
});
