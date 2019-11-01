import { TestBed, inject } from '@angular/core/testing';

import { TypeSettingsService } from './type-settings.service';

describe('TypeSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeSettingsService]
    });
  });

  it('should be created', inject([TypeSettingsService], (service: TypeSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
