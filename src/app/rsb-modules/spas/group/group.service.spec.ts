import { TestBed, inject } from '@angular/core/testing';

import { GroupService } from './group.service';

describe('StaffService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupService]
    });
  });

  it('should be created', inject([GroupService], (service: GroupService) => {
    expect(service).toBeTruthy();
  }));
});
