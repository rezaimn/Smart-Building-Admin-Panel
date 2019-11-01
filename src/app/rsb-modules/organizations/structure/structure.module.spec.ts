import { StructureModule } from './structure.module';

describe('StructureModule', () => {
  let structureModule: StructureModule;

  beforeEach(() => {
    structureModule = new StructureModule();
  });

  it('should create an instance', () => {
    expect(structureModule).toBeTruthy();
  });
});
