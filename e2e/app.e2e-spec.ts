import { AppPage } from './app.po';
import { logPromiseError } from '../src/app/testing/log-error';

describe('testing App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', async () => {
    void await page.navigateTo();
    page.getParagraphText().then((val) => {
      expect(val).toEqual('Welcome to app!').catch(logPromiseError);
    }).catch(logPromiseError);
  });
});
