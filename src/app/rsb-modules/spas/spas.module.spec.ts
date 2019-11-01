import { SpasModule } from './spas.module';

describe('SpasModule', () => {
  let spasModule: SpasModule;

  beforeEach(() => {
    spasModule = new SpasModule();
  });

  it('should create an instance', () => {
    expect(spasModule).toBeTruthy();
  });
});
