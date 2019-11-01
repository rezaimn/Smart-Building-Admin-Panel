import { TestBed, inject } from '@angular/core/testing';

import { PlugService } from './plug.service';

describe('PlugService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlugService]
    });
  });

  it('should be created', inject([PlugService], (service: PlugService) => {
    expect(service).toBeTruthy();
  }));
});
