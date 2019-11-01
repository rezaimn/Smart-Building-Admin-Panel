import { GradeModule } from './grade.module';

describe('GradeModule', () => {
  let gradeModule: GradeModule;

  beforeEach(() => {
    gradeModule = new GradeModule();
  });

  it('should create an instance', () => {
    expect(gradeModule).toBeTruthy();
  });
});
