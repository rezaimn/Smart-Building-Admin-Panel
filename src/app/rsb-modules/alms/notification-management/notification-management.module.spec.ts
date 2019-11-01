import { NotificationManagementModule } from './notification-management.module';

describe('NotificationManagementModule', () => {
  let notificationManagementModule: NotificationManagementModule;

  beforeEach(() => {
    notificationManagementModule = new NotificationManagementModule();
  });

  it('should create an instance', () => {
    expect(notificationManagementModule).toBeTruthy();
  });
});
