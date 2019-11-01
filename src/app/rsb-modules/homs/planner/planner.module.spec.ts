import { PlannerModule } from './planner.module';

describe('PlannerModule', () => {
  let plannerModule: PlannerModule;

  beforeEach(() => {
    plannerModule = new PlannerModule();
  });

  it('should create an instance', () => {
    expect(plannerModule).toBeTruthy();
  });
});
