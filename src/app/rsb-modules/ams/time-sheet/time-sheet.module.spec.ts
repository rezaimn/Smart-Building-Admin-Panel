import { TimeSheetModule } from './time-sheet.module';

describe('TimeSheetModule', () => {
  let timeSheetModule: TimeSheetModule;

  beforeEach(() => {
    timeSheetModule = new TimeSheetModule();
  });

  it('should create an instance', () => {
    expect(timeSheetModule).toBeTruthy();
  });
});
