import { TypeSettingsModule } from './type-settings.module';

describe('TypeSettingsModule', () => {
  let roleModule: TypeSettingsModule;

  beforeEach(() => {
    roleModule = new TypeSettingsModule();
  });

  it('should create an instance', () => {
    expect(roleModule).toBeTruthy();
  });
});
