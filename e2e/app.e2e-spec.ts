import { MitoConnectRsbPage } from './app.po';

describe('mitoconnect-rsb App', function() {
  let page: MitoConnectRsbPage;

  beforeEach(() => {
    page = new MitoConnectRsbPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
