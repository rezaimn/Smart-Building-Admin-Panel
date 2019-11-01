import { TestBed, inject } from '@angular/core/testing';

import { DeviceConService } from './device.service';

describe('DeviceConService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceConService]
    });
  });

  it('should be created', inject([DeviceConService], (service: DeviceConService) => {
    expect(service).toBeTruthy();
  }));
});
