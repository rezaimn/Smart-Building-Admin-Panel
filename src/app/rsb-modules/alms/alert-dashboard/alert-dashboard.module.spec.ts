import { AlertDashboardModule } from './alert-dashboard.module';

describe('AlertDashboardModule', () => {
  let alertDashboardModule: AlertDashboardModule;

  beforeEach(() => {
    alertDashboardModule = new AlertDashboardModule();
  });

  it('should create an instance', () => {
    expect(alertDashboardModule).toBeTruthy();
  });
});
