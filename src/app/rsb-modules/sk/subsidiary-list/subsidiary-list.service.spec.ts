import { TestBed, inject } from '@angular/core/testing';

import { SubsidiaryListService } from './subsidiary-list.service';

describe('SubsidiaryListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubsidiaryListService]
    });
  });

  it('should be created', inject([SubsidiaryListService], (service: SubsidiaryListService) => {
    expect(service).toBeTruthy();
  }));
});
