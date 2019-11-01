import { EmergencyModule } from './emergency.module';

describe('EmergencyModule', () => {
  let emergencyModule: EmergencyModule;

  beforeEach(() => {
    emergencyModule = new EmergencyModule();
  });

  it('should create an instance', () => {
    expect(emergencyModule).toBeTruthy();
  });
});
