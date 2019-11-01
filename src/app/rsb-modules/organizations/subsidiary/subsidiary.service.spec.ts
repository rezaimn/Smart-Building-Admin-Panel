import { TestBed, inject } from '@angular/core/testing';

import { SubsidiaryService } from './subsidiary.service';


describe('SubsidiaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubsidiaryService]
    });
  });

  it('should be created', inject([SubsidiaryService], (service: SubsidiaryService) => {
    expect(service).toBeTruthy();
  }));
});
