import { SecurityModule } from './security.module';

describe('TicketManagementModule', () => {
  let securityModule: SecurityModule;

  beforeEach(() => {
    securityModule = new SecurityModule();
  });

  it('should create an instance', () => {
    expect(securityModule).toBeTruthy();
  });
});
