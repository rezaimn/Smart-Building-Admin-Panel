import { SemsModule } from './sems.module';

describe('SemsModule', () => {
  let semsModule: SemsModule;

  beforeEach(() => {
    semsModule = new SemsModule();
  });

  it('should create an instance', () => {
    expect(semsModule).toBeTruthy();
  });
});
