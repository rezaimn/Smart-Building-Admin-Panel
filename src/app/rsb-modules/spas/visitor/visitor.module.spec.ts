import { VisitorModule } from './visitor.module';

describe('VisitorModule', () => {
  let visitorModule: VisitorModule;

  beforeEach(() => {
    visitorModule = new VisitorModule();
  });

  it('should create an instance', () => {
    expect(visitorModule).toBeTruthy();
  });
});
