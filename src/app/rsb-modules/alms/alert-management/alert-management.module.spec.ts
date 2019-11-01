import { AlertManagementModule } from './alert-management.module';

describe('AlertManagementModule', () => {
  let alertManagementModule: AlertManagementModule;

  beforeEach(() => {
    alertManagementModule = new AlertManagementModule();
  });

  it('should create an instance', () => {
    expect(alertManagementModule).toBeTruthy();
  });
});
