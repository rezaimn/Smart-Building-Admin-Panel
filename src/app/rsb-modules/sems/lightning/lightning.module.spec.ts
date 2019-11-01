import { LightningModule } from './lightning.module';

describe('LightningModule', () => {
  let lightningModule: LightningModule;

  beforeEach(() => {
    lightningModule = new LightningModule();
  });

  it('should create an instance', () => {
    expect(lightningModule).toBeTruthy();
  });
});
