import { UrlModule } from './url.module';

describe('UrlModule', () => {
  let urlModule: UrlModule;

  beforeEach(() => {
    urlModule = new UrlModule();
  });

  it('should create an instance', () => {
    expect(urlModule).toBeTruthy();
  });
});
