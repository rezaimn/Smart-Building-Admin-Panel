import { OrganizationsModule } from './organizations.module';

describe('OrganizationsModule', () => {
  let organizationsModule: OrganizationsModule;

  beforeEach(() => {
    organizationsModule = new OrganizationsModule();
  });

  it('should create an instance', () => {
    expect(organizationsModule).toBeTruthy();
  });
});
