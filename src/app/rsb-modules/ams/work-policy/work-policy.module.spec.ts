import { WorkPolicyModule } from './work-policy.module';

describe('WorkPolicyModule', () => {
  let workPolicyModule: WorkPolicyModule;

  beforeEach(() => {
    workPolicyModule = new WorkPolicyModule();
  });

  it('should create an instance', () => {
    expect(workPolicyModule).toBeTruthy();
  });
});
