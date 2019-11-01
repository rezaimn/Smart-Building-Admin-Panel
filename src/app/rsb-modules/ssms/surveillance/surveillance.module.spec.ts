import { SurveillanceModule } from './surveillance.module';

describe('SurveillanceService', () => {
  let surveillanceModule: SurveillanceModule;

  beforeEach(() => {
    surveillanceModule = new SurveillanceModule();
  });

  it('should create an instance', () => {
    expect(surveillanceModule).toBeTruthy();
  });
});
