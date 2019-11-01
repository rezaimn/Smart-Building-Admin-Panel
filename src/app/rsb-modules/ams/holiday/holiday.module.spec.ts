import { HolidayModule } from './holiday.module';

describe('HolidayModule', () => {
  let holidayModule: HolidayModule;

  beforeEach(() => {
    holidayModule = new HolidayModule();
  });

  it('should create an instance', () => {
    expect(holidayModule).toBeTruthy();
  });
});
