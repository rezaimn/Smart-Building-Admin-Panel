import { AllowanceModule } from './allowance.module';

describe('AllowanceModule', () => {
  let allowanceModule: AllowanceModule;

  beforeEach(() => {
    allowanceModule = new AllowanceModule();
  });

  it('should create an instance', () => {
    expect(allowanceModule).toBeTruthy();
  });
});
