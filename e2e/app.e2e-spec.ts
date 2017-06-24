import { MarketPlacePage } from './app.po';

describe('market-place App', () => {
  let page: MarketPlacePage;

  beforeEach(() => {
    page = new MarketPlacePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
