import { SubsidiaryModule } from './subsidiary.module';

describe('SubsidiaryModule', () => {
  let subsidiaryModule: SubsidiaryModule;

  beforeEach(() => {
    subsidiaryModule = new SubsidiaryModule();
  });

  it('should create an instance', () => {
    expect(subsidiaryModule).toBeTruthy();
  });
});
