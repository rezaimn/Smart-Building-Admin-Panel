import { SubsidiaryListModule } from './subsidiary-list.module';

describe('SubsidiaryListModule', () => {
  let subsidiaryListModule: SubsidiaryListModule;

  beforeEach(() => {
    subsidiaryListModule = new SubsidiaryListModule();
  });

  it('should create an instance', () => {
    expect(subsidiaryListModule).toBeTruthy();
  });
});
