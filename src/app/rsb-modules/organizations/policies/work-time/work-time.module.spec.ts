import { WorkTimeModule } from './work-time.module';

describe('WorkTimeModule', () => {
  let workTimeModule: WorkTimeModule;

  beforeEach(() => {
    workTimeModule = new WorkTimeModule();
  });

  it('should create an instance', () => {
    expect(workTimeModule).toBeTruthy();
  });
});
