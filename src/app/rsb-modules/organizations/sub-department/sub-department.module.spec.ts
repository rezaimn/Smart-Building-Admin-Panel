import { SubDepartmentModule } from './sub-department.module';

describe('SubDepartmentModule', () => {
  let subDepartmentModule: SubDepartmentModule;

  beforeEach(() => {
    subDepartmentModule = new SubDepartmentModule();
  });

  it('should create an instance', () => {
    expect(subDepartmentModule).toBeTruthy();
  });
});
