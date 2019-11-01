import { LeaveModule } from './leave.module';

describe('LeaveModule', () => {
  let leaveModule: LeaveModule;

  beforeEach(() => {
    leaveModule = new LeaveModule();
  });

  it('should create an instance', () => {
    expect(leaveModule).toBeTruthy();
  });
});
